import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { csrfToken, useSession } from 'next-auth/client'

import Button from "../components/Button";


export default function SignIn({ csrfToken }) {	
	//	handling errors
	const [ errorMsg, setErrorMsg ] = useState('');
	useEffect(() => {
		const fetchErrors = () => {
			const urlParams = new URLSearchParams(window.location.search);	
			switch(urlParams.get('error')){
				case null:
					setErrorMsg("");
					break;
				case 'WrongCredentials':
					setErrorMsg("Nieprawidłowy numer telefonu lub hasło");
					break;
				case 'AccountNotActivated':
					setErrorMsg("Konto nie zostało jeszcze aktywowane");
					break;
				default:
					setErrorMsg("Wystąpił nieoczekiwany błąd podczas próby logowania. Spróbuj ponownie");
					break;
			}	
		};
		fetchErrors();
	}, []);
	
	const [ session, loading ] = useSession();
	if(!loading && session) location.href = '/';
	else return (
		<>
			<Head>
				<title>Nowa Ty - Salon urody :: Logowanie</title>
				<link rel="icon" href="/favicon.ico" />

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta charSet='utf-8' />

				{/* https://stackoverflow.com/a/33193739 */}
				<meta name="theme-color" content="#19606B" />
				<meta name="msapplication-navbutton-color" content="#19606B" />
				<meta name="apple-mobile-web-app-status-bar-style" content="#19606B" />
			</Head>

			<div className='wrapper'>
				<a href='/'><img className='logo' src='/img/logo.jpg' alt='logo' title='Powrót do strony głównej' /></a>
				<form action="/api/auth/callback/credentials" method="post">
					<p className='errors'>{errorMsg}</p>
					<br />
					<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
					<label onClick={() => setErrorMsg("")}>
						Numer telefonu: <br />
						<input name='phone' type='text' required autoComplete='off' />
					</label>
					<br />
					<label onClick={() => setErrorMsg("")}>
						Hasło: <br />
						<input name='password' type='password' required autoComplete='off' />
					</label>
					<br />
					<br />
					<Button href='' type='submit'>
						Zaloguj się
					</Button>
					<br />
					<br />
					<p className='newaccount'>Nie masz jeszcze konta? - <span><a href='/signup'>załóż nowe</a></span></p>
					<p className='newaccount'>Nowe konto? - <span><a href='/activate'>aktywuj je</a></span></p>
				</form>

				
				<style jsx>{`
					.wrapper {
						position: relative;
						width: 100vw;
						height: 100vh;
						display: flex;
						flex-direction: column;
						align-items: center;

						@media (min-width:768px) {
							//	desktop
							align-items: flex-start;
						}

						:before {
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							z-index: -1;
							background-image: url("/img/backgrounds/hello.jpg");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center;
							filter: brightness(.6);
						}

						img {
							width: 15vh;
							height: 15vh;
							margin: 5vh;
							border-radius: 90px;
							cursor: pointer;
							z-index: 10;
							transition-duration: 0.15s;

							:hover {
								transform: scale(1.3) translate(1vw, 1vw);
							}
						}

						.errors {
							opacity: ${errorMsg ? 1 : 0};
							background-color: rgba(#FF0000, .2);
							color: #000000;
							padding: 2vh 5vw;
							border: 5px solid red;
						}

						form {
							position: absolute;
							top: 50vh;
							left: 50vw;
							transform: translate(-50%, -50%);
							width: 70vw;
							padding: 5vh;
							background-color: rgba(#FFFFFF, .4);
							border-radius: 30px;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							font-size: .6em;
							color: white;

							@media (min-width:768px) {
								//	desktop
								padding: 5vw;
								width: 50vw;
							}

							label {
								color: #000000;
								font-size: 1.2em;
							}

							input {
								font-size: .7em;
								padding: .5em 1em;
								border: 3px solid #CCCCCC;
								outline: none;
								transition-duration: .5s;

								:focus {
									border: 3px solid #000000;
								}
							}
						}

						.newaccount {
							font-size: 1.2em;
							color: #000000;
							margin: 0;

							span {
								font-weight: bold;
							}
						}
					}
				`}</style>
			</div>
		</>
	)
}

SignIn.getInitialProps = async (context) => {
	return {
		csrfToken: await csrfToken(context)
	}
}