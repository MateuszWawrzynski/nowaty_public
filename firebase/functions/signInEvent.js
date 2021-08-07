const admin = require('firebase-admin');
const credentials = require('./credentials.js');

const axios = require('axios');
axios.defaults.baseURL = credentials.firebase.apiURL;

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: "gmail",
	port: 25,
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.pass
	}
});


exports.signInEvent = (request, response) => {
	const newEvent = {
		surname: request.body.surname,
		phone: request.body.phone,
		service: request.body.service,
		duration: request.body.duration,
		employee: request.body.employee,
		subcalendarID: request.body.subcalendarID,
		date: request.body.date,
		recaptchaToken: request.body.recaptchaToken
	}

	axios.post(`https://google.com/recaptcha/api/siteverify?secret=${credentials.recaptcha.tokenSecret}&response=${newEvent.recaptchaToken}`)
	.then(res => {
		if(res.data.success){
			//	check if its saving daylight time - https://stackoverflow.com/a/11888430/14536846
			Date.prototype.stdTimezoneOffset = function () {
				var jan = new Date(this.getFullYear(), 0, 1);
				var jul = new Date(this.getFullYear(), 6, 1);
				return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
			}	
			Date.prototype.dst = function () {
				return (this.getTimezoneOffset() < this.stdTimezoneOffset()) ? 1 : 0;
			}
			
			let pickedDate = new Date(newEvent.date);
	
			let dateEventStart = pickedDate.getTime() + ((1+pickedDate.dst())*60*60*1000);	//(+1hour timezone + ?dst) * 60minutes * 60seconds * 1000miliseconds
			dateEventStart = new Date(dateEventStart).toISOString().slice(0, 16);
			
			let dateEventEnd = pickedDate.getTime() + (((1+pickedDate.dst())*60 + newEvent.duration)*60*1000);	//start time + event duration
			dateEventEnd = new Date(dateEventEnd).toISOString().slice(0, 16);	
			
			let data = {
				header: {
					headers: {
						"Teamup-Token": credentials.teamup.teamupAPIKey,
						"Content-type": 'application/json'
					}
				},
				body: {
					"subcalendar_id": newEvent.subcalendarID,
					"start_dt": dateEventStart,
					"end_dt": dateEventEnd,
					"title": newEvent.surname,
					"who": newEvent.phone,
					"notes": `Numer telefonu: ${newEvent.phone}<br><br>Rodzaj usługi: ${newEvent.service}<br>Pracownik: ${newEvent.employee}`
				}
			};

			// console.log(data);
			axios.post(`https://api.teamup.com/${credentials.teamup.calendarAdminID}/events`, data.body, data.header)
			.then(res => {
				if(res.status == 201){
					admin
						.firestore()
						.collection('events')
						.add({
							service: newEvent.service,
							duration: newEvent.duration,
							employee: newEvent.employee,
							date: newEvent.date
						})
						.then(() => {
							response.status(201).json({
								message: "Termin został zarezerwowany poprawnie."
							});
						})
				
					const mailInfo = {
						to: "nowaty.kontakt@gmail.com",
						subject: "Nowa rezerwacja terminu",
						html: `
							<h2 style='margin-bottom:0'>Klient/ka właśnie zarezerwował/a nowy termin!</h2>
							<h4 style='margin-top:0'>(ID: <a href='https://teamup.com/c/895c4o/nowaty/events/${res.data.event.id}'>${res.data.event.id}</a>)</h4>
							<p>
								Dane klienta/ki: <br>
								<ul>
									<li>${newEvent.surname}</li>
									<li>Tel.: <a href='tel:${newEvent.phone}'>${newEvent.phone}</a></li>
								</ul>
							</p>
							<p>
								Szczegóły rezerwacji: <br>
								<ul>
									<li>${newEvent.service} (~${newEvent.duration} minut)</li>
									<li>Do wykonania przez: ${newEvent.employee}</li>
									<li>W dniu: ${new Date(newEvent.date).toLocaleDateString()}</li>
									<li>O godzinie: ${new Date(newEvent.date).toLocaleTimeString()}</li>
								</ul>
							</p>
						`
					};
					transporter.sendMail(mailInfo);
				}
			})
			.catch(err => {
				response.status(500).json({
					message: "Wystąpił błąd podczas próby wysłania formularza. Spróbuj ponownie później. [#E013]",
					error: err.message
				});
				console.error(err);
			});
		}
		else{
			response.status(500).json({message: "Wystąpił błąd podczas próby wysłania formularza. Spróbuj ponownie później. [#E014]"});
			console.error(err);
		}
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby wysłania formularza. Spróbuj ponownie później. [#E015]",
			error: err.message
		});
		console.error(err);
	});	
}