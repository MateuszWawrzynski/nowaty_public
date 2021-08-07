// const withCSS = require('@zeit/next-css')
// const withSass = require('@zeit/next-sass')

//	load fonts
const withFonts = require('next-fonts')
module.exports = withFonts()

//	load env variables
module.exports = {
	env: {
		NEXTAUTH_URL: "https://nowaty.vercel.app",
		NEXTAUTH_SITE: "https://nowaty.vercel.app",
		
		FIREBASE_APIURL: "https://europe-west3-nowaty-7bc84.cloudfunctions.net/api",

		RECAPTCHA_TOKEN_PUBLIC: "6LeDrTQaAAAAADMnehSAyle4GXw9hJvAz2NKspsn",

		TEAMUP_CALENDAR_CLIENTID: "ks344p46eps2nprgr3",

		EMBEDSOCIAL_GALLERY_ID: "03cc22c46f370573b5b7f5106dce560191ef27ba"
	}
}
