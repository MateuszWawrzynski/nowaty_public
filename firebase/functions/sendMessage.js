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


exports.sendMessage = (request, response) => {
	const mailInfo = {
		from: `Formularz kontaktowy ${request.body.mail}`,
		to: "nowaty.kontakt@gmail.com",
		replyTo: request.body.mail,
		subject: "Wiadomość ze strony",
		html: `
			${request.body.mail} pisze:
			<br><br>
			${request.body.msg}
		`
	};
	const mailThankYou = {
		from: `Salon urody "Nowa Ty" nowaty.kontakt@gmail.com`,
		to: request.body.mail,
		subject: "Formularz kontaktowy",
		html: `
			<h2>Witaj!</h2>
			<p>
				Dziękujemy za kontakt poprzez nasz formularz kontaktowy!<br>
				Twoja wiadomość została dostarczona i możesz oczekiwać odpowiedzi w niedalekiej przyszłości.
			</p>
			<p>
				Dziękujemy i zapraszamy na <a href='https://nowaty.now.sh'>nowaty.now.sh</a>
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
				został wykorzystany do wysłania wiadomości poprzez nasz formularz kontaktowy.<br>
				Jeżeli to nie Ty skorzystałeś/aś z naszego formularza - przepraszamy i prosimy o zignorowanie tej wiadomości.
			</small>
			<br><br>
			<small>Wiadomość została wygenerowana automatycznie.</small>
		`
	};

	axios.post(`https://google.com/recaptcha/api/siteverify?secret=${credentials.recaptcha.tokenSecret}&response=${request.body.recaptchaToken}`)
	.then(res => {
		if(res.data.success){
			transporter.sendMail(mailInfo, (err, info) => {
				if(err) response.status(500).json({message: `Nie udało się wysłać wiadomości. [#E008]`, err});
				else {
					response.status(200).json({message: `Pomyślnie wysłano wiadomość.`, info});
					transporter.sendMail(mailThankYou);
				}		
			});
		}
		else{
			response.status(500).json({message: "Wystąpił błąd podczas próby wysłania wiadomości. Spróbuj ponownie później. [#E009]"});
		}
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby wysłania wiadomości. Spróbuj ponownie później. [#E010]",
			error: err.message
		});
	});
}