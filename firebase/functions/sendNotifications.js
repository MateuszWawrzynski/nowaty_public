//	this code will be executed everyday through cron

const credentials = require('./credentials.js');

const axios = require('axios');
axios.defaults.baseURL = credentials.firebase.apiURL;


exports.sendNotifications = (request, response) => {
	let calendarData = {
		header: {
			headers: {
				"Teamup-Token": credentials.teamup.teamupAPIKey,
				"Content-type": 'application/json'
			}
		}
	};

	let smsData = {
		username: credentials.serwersms.username,
		password: credentials.serwersms.password,
		messages: []
	}

	axios.get(`https://api.teamup.com/${credentials.teamup.calendarAdminID}/events`, calendarData.header)
	.then(res => {
		//	make array with messages to send
		res.data.events.forEach(item => {
			smsData.messages.push({
				phone: item.who,
				text: `Przypominamy o dzisiejszej rezerwacji w salonie Nowa Ty na godzinę ${new Date(item.start_dt).toLocaleTimeString()}.\n Prosimy o wcześniejszy kontakt w przypadku braku możliwości przybycia.`
			})
		});

		//	send all messages
		axios.post('https://api2.serwersms.pl/messages/send_personalized', smsData)
		.then(res => {
			response.status(200).json({
				message: `Pomyślnie wysłano ${res.data.queued}/${res.data.queued+res.data.unsent} wiadomości z przypomnieniami.`,
				result: res.data,
				messages: smsData.messages
			});
		})
		.catch(err => {
			response.status(500).json({
				message: "Wystąpił błąd podczas próby wysłania wiadomości z przypomnieniami. [#E011]",
				error: err.message
			});
		});
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby pobrania danych z kalendarza. [#E012]",
			error: err.message
		});
	});
}