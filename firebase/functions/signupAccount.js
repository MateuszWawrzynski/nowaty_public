const credentials = require('./credentials');

const admin = require('firebase-admin');

const axios = require('axios');

const md5 = require('crypto-js/md5');
const sha1 = require('crypto-js/sha1');


exports.signupAccount = (request, response) => {
	const { phone, password, name, surname, email } = request.body;
	
	const generatedCode = (Math.floor(Math.random() * (Math.floor(999999) - Math.ceil(100000))) + Math.ceil(100000)).toString();
	console.log("Wygenerowany kod sms", generatedCode);	// temp

	const newUser = {
		phone,
		password: sha1(md5(password)).toString(),
		name,
		surname,
		email,
		admin: false,
		perm_signin_events: true,
		perm_send_messages: true,
		perm_add_comments: true,
		activated: generatedCode
	}
	
	axios.post(`https://google.com/recaptcha/api/siteverify?secret=${credentials.recaptcha.tokenSecret}&response=${request.body.recaptchaToken}`)
	.then(res => {
		if(res.data.success){
			admin
				.firestore()
				.collection('accounts')
				.add(newUser)
				.then(data => {
					//	send generated code to client by sms
					const sms = {
						username: credentials.serwersms.username,
						password: credentials.serwersms.password,
						messages: [{
							phone: newUser.phone,
							text: `Twój 6-cio cyfrowy kod do aktywacji konta to: ${generatedCode}`
						}]
					}

					axios.post('https://api2.serwersms.pl/messages/send_personalized', sms)
					.then(res => {
						// console.log(res.data, "sms");
						if(res.data.success){
							response.status(200).json({id: data.id});
						}
						else{
							response.status(500).json({
								message: "Nie udało się wysłać wiadomości z kodem aktywacyjnym. Spróbuj ponownie później. [#E016]",
							});
						}
					})
					.catch(err => {
						response.status(500).json({
							message: "Wystąpił błąd podczas próby wysłania wiadomości z kodem aktywacyjnym. Spróbuj ponownie później. [#E017]",
							error: err.message
						});
					});
				})
				.catch(err => {
					response.status(500).json({
						message: 'Nie udało się utworzyć nowego konta. [#E018]',
						error: err.message
					});
					console.log(error);
				});
		}
		else{
			response.status(500).json({message: "Wystąpił błąd podczas próby utworzenia konta. Spróbuj ponownie później. [#E019]"});
		}
	})
	.catch(err => {
		response.status(500).json({message: "Wystąpił błąd podczas próby utworzenia konta. Spróbuj ponownie później. [#E020]"});
	});
}