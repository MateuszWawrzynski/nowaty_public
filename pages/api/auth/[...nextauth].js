import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import axios from 'axios';
axios.defaults.baseURL = process.env.FIREBASE_APIURL;

const sha1 = require('crypto-js/sha1');
const md5 = require('crypto-js/md5');


export default (req, res) => 
    NextAuth(req, res, {
		providers: [
			Providers.Credentials({
				name: 'Credentials',
				credentials: {
					phone: { label: "Numer telefonu", type: "text" },
					password: { label: "Haslo", type: "password" }
				},
				authorize: async (loginData) => {
					const { csrfToken, phone, password } = loginData;
					
					//	checking if there is account with these credentials
					let res = await login({
						phone, 
						password: sha1(md5(password)).toString()
					})

					//	200 = OK, 202 = WRONG CREDENTIALS, other code = ERROR
					if(res.status == 200){
						//	check if account was activated
						if(res.data.info.activated == "true"){
							//	collect account data
							const user = {
								phone,
								...res.data.info
							}
							return Promise.resolve(user);
						}
						else{
							//	account is not activated by sms code
							return Promise.reject("/signin?error=AccountNotActivated");
						}
					}
					else {
						//	wrong credentials
						return Promise.reject("/signin?error=WrongCredentials");
					}
				}
			})
		],
		callbacks: {
			jwt: async (token, user, account, profile, isNewUser) => {
				//	"user" parameter is the object received from "authorize"
				//	"token" is being send below to "session" callback...
				//	...so we set "user" param of "token" to object from "authorize"...
				//	...and return it...
				user && (token.user = user);
				return Promise.resolve(token)	// ...here
			},
			session: async (session, user, sessionToken) => {
				//	"session" is our current session object
				//	below we set "user" param of "session" to value received from "jwt" callback
				session.user = user.user;
				return Promise.resolve(session)
			}
		},
		
		pages: {
			signIn: '/signin'
		},

		session: {
			//	session expires after 7 days
			maxAge: 7 * 24 * 60 * 60
		},
		
		site: process.env.NEXTAUTH_URL || "localhost:3000",
		debug: false
	})


//	function which sends login request to rest api and returns result
//	https://stackoverflow.com/q/64244115
const login = async data => await axios.post('/checkCredentials', data);
