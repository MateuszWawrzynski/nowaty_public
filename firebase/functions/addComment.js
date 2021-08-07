const credentials = require('./credentials');

const admin = require('firebase-admin');

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


exports.addComment = (request, response) => {
	const newComment = {
		author: request.body.nick,
		content: request.body.msg,
		addDate: admin.firestore.Timestamp.fromDate(new Date(request.body.date))
	}
	
	axios.post(`https://google.com/recaptcha/api/siteverify?secret=${credentials.recaptcha.tokenSecret}&response=${request.body.recaptchaToken}`)
	.then(res => {
		if(res.data.success){
			admin
				.firestore()
				.collection('comments')
				.add(newComment)
				.then(data => {
					response.status(201).json({
						message: 'Pomyślnie dodano nowy komentarz.',
						commentID: data.id
					});

					const mailInfo = {
						to: "nowaty.kontakt@gmail.com",
						subject: "Nowy komentarz na stronie",
						html: `
							<h2 style='margin-bottom:0'>Na stronie <a href='https://nowaty.now.sh'>nowaty.now.sh</a> pojawił się nowy komentarz!</h2>
							<h4 style='margin-top:0'>(ID: <a href='https://console.firebase.google.com/project/nowaty-7bc84/firestore/data~2Fcomments~2F${data.id}'>${data.id}</a>)</h4>
							<p>	
								Autor komentarza: ${newComment.author}<br>
								Treść komentarza: <br>
								${newComment.content}
							</p>
						`
					};
					transporter.sendMail(mailInfo);
				})
				.catch(err => {
					response.status(500).json({
						message: 'Nie udało się dodać nowego komentarza. [#E001]',
						error: err.message
					});
					console.log(error);
				});
		}
		else{
			response.status(500).json({message: "Wystąpił błąd podczas próby dodania komentarza. Spróbuj ponownie później. [#E002]"});
		}
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby dodania komentarza. Spróbuj ponownie później. [#E003]",
			error: err.message
		});
	});
}