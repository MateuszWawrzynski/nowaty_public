import React, { Component } from 'react'
import Head from 'next/head'

import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import Button from '../components/Button'


export default class Activate extends Component {
	constructor(props){
		super(props);
		this.state = {
			phone: '',
			code: '',

			recaptchaToken: '',

			resultError: ''
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	recaptchaRef = React.createRef();

	handleChange(event){
		const name = event.target.name;
		this.setState({
			[name]: event.target.value,
		});

		//	https://stackoverflow.com/a/30607466 + max 6 characters
		if(event.target.name == 'code'){
			this.setState({
				code: event.target.value.replace(/\D/g, "").slice(0, 6)
			});
		}
	}

	handleSubmit(event){
		event.preventDefault();

		if(this.state.phone.length != 9){
			this.setState({
				resultError: 'Zły format numeru telefonu. Podaj tylko 9 cyfr, bez spacji.'
			})
		}
		else if(this.state.code.length != 6){
			this.setState({
				resultError: 'Zły format kodu aktywacyjnego. Kod składa się z 6 cyfr.'
			})
		}
		else{
			this.recaptchaRef.current.executeAsync()
			.then(res => {
				this.setState({
					recaptchaToken: res
				});
				
				this.recaptchaRef.current.reset();
				// console.log(res, "recaptchaToken");

				axios.post('/activateAccount', {phone: this.state.phone, code: this.state.code})
				.then(res => {
					//	account activated successfully
					if(res.status == 200){
						this.setState({
							resultError: "Konto zostało aktywowane. Można się zalogować."
						})
						setTimeout(() => {location.href = '/signin'}, 3*1000);
					}
					else {
						//	something went wrong
						this.setState({
							resultError: "Wystąpił błąd podczas aktywacji konta. Sprawdź poprawność podanego numeru telefonu oraz kodu aktywacyjnego."
						})
					}
				})
				.catch(err => {
					console.error(err);
		
					this.setState({
						resultError: err.message
					})	
				});
			})
			.catch(err => {
				console.error(err);
	
				this.setState({
					resultError: err.message
				})	
			});
		}
	}

	render() {
		return (
			<>
				<Head>
					<title>Nowa Ty - Salon urody :: Aktywacja konta</title>
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
					<form onSubmit={this.handleSubmit}>
						<p className='errors'>{this.state.resultError}</p>
						<label>
							Numer telefonu: <br />
							<input name='phone' type='text' value={this.state.phone} onChange={this.handleChange} required autoComplete='off' />
						</label>
						<br />
						<label>
							Kod aktywacyjny: <br />
							<input name='code' type='text' value={this.state.code} onChange={this.handleChange} required autoComplete='off' />
						</label>
						<br />
						<br />
						<Button href='' type='submit'>
							Aktywuj konto
						</Button>
						<br />
						<br />
					</form>

					<ReCAPTCHA 
						sitekey={process.env.RECAPTCHA_TOKEN_PUBLIC} 
						size='invisible' 
						ref={this.recaptchaRef}
					/>
					
					
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
								background-image: url("/img/backgrounds/activate.jpg");
								background-size: cover;
								background-repeat: no-repeat;
								background-position: left top;
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
								opacity: ${this.state.resultError ? 1 : 0};
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
						}
					`}</style>
				</div>
			</>
		)
	}
}
