const sha1 = require('crypto-js/sha1');
const md5 = require('crypto-js/md5');

const credentials = require('./credentials.js');

const axios = require('axios');
axios.defaults.baseURL = credentials.firebase.apiURL;


exports.sendConfirmCode = (request, response) => {
	//	generate code for client and hash from code and phone number
	const generatedCode = Math.floor(Math.random() * (Math.floor(999999) - Math.ceil(100000))) + Math.ceil(100000);
	const generatedHash = sha1(md5(generatedCode + request.body.phone)).toString();

	console.log("Wygenerowany kod sms", generatedCode);	// temp
	// console.log("Wygenerowany hash", generatedHash);

	//	send generated code to client by sms
	const data = {
		username: credentials.serwersms.username,
		password: credentials.serwersms.password,
		messages: [{
			phone: request.body.phone,
			text: `Twój 6-cio cyfrowy kod aktywacyjny do potwierdzenia rezerwacji w salonie Nowa Ty to: ${generatedCode}`
		}]
	}

	axios.post('https://api2.serwersms.pl/messages/send_personalized', data)
	.then(res => {
		// console.log(res.data, "sms");
		if(res.data.success){
			//	send generated hash and store it in component state
			response.status(200).json({
				hashConfirmCode: generatedHash
			});
		}
		else{
			response.status(500).json({
				message: "Nie udało się wysłać wiadomości z kodem aktywacyjnym. Spróbuj ponownie później. [#E006]",
			});
		}
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby wysłania wiadomości z kodem aktywacyjnym. Spróbuj ponownie później. [#E007]",
			error: err.message
		});
	});
}