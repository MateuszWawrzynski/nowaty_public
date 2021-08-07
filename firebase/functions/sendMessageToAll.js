const admin = require('firebase-admin');

const credentials = require('./credentials');

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


exports.sendMessageToAll = (request, response) => {
	admin
		.firestore()
		.collection('accounts')
		.get()
		.then(res => {
			let list_phoneNumbers = [];
			let list_emails = [];
			
			res.forEach(item => {
				list_phoneNumbers.push(item.data().phone);
				if(item.data().email != '') list_emails.push(item.data().email);
			});

			if(request.body.msgtype == 'sms'){
				const data = {
					username: credentials.serwersms.username,
					password: credentials.serwersms.password,
					messages: [{
						phone: list_phoneNumbers,
						text: request.body.msg
					}]
				}
			
				axios.post('https://api2.serwersms.pl/messages/send_personalized', data)
				.then(res => {
					// console.log(res.data, "sms");
					if(res.data.success){
						response.status(200).json({
							message: "Wysłano wiadomości SMS."
						});
					}
					else{
						response.status(500).json({
							message: "Nie udało się wysłać wiadomości SMS. Spróbuj ponownie później.",
						});
					}
				})
				.catch(err => {
					response.status(500).json({
						message: "Wystąpił błąd podczas próby wysłania wiadomości SMS. Spróbuj ponownie później.",
						error: err.message
					});
				});
			}
			else if(request.body.msgtype == 'email'){
				const mailInfo = {
					from: `Salon urody "Nowa Ty" nowaty.kontakt@gmail.com`,
					to: userEmail,
					subject: "Kontakt",
					html: `
						<h2>Witaj!</h2>
						<p>
							${request.body.msg}
						</p>
						<p>
							Zapraszamy na <a href='https://nowaty.now.sh'>nowaty.now.sh</a>
						</p>
						<p><i>
							<a href="https://maps.google.com/maps?ll=52.553571,19.688746&z=16&t=m&hl=pl&gl=PL&mapclient=embed&q=Tysi%C4%85clecia%2010%2009-400%20P%C5%82ock">
								Nowa Ty - Salon Urody<br>
								ul. Tysiąclecia 10 lok.36<br>
								09-400 Płock
							</a>
							<br><br>
							Tel.: <a href="tel:730197529">730 197 529</a>
						</i></p>
						<br>
						<small>
							Niniejsza wiadomość została do Ciebie wysłana, ponieważ ten adres e-mail<br>
							został wykorzystany do utworzenia konta na stronie <a href='https://nowaty.now.sh'>nowaty.now.sh</a>.
						</small>
					`
				};

				transporter.sendMail(mailInfo, (err, info) => {
					if(err) response.status(500).json({message: `Nie udało się wysłać wiadomości e-mail.`, err});
					else {
						response.status(200).json({message: `Pomyślnie wysłano wiadomości e-mail.`, info});
					}		
				});
			}
		})
		.catch(err => {
			return response.status(500).json({
				message: "Nie udało się pobrać danych kontaktowych użytkowników."
			});
		});
}