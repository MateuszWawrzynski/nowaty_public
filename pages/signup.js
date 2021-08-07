import React, { Component } from 'react'
import Head from 'next/head'

import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import Button from '../components/Button'


export default class SignUp extends Component {
	constructor(props){
		super(props);
		this.state = {
			phone: '',
			password: '',
			passwordagain: '',
			name: '',
			surname: '',
			email: '',

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

		//	https://stackoverflow.com/a/30607466 + max 9 characters
		if(event.target.name == 'phone'){
			this.setState({
				phone: event.target.value.replace(/\D/g, "").slice(0, 9)
			});
		}
	}

	handleSubmit(event){
		event.preventDefault();

		//	if both password fields have same value
		if(this.state.password != this.state.passwordagain){
			this.setState({
				resultError: 'Pola zawierające hasło różnią się od siebie.'
			})
		}
		//	if password length is less than 8 chars
		else if(this.state.password.length < 8){
			this.setState({
				resultError: 'Hasło musi mieć co najmniej 8 znaków.'
			})
		}
		//	if phone number doesnt have exactly 9 digits
		else if(this.state.phone.length != 9){
			this.setState({
				resultError: 'Zły format numeru telefonu. Podaj tylko 9 cyfr, bez spacji.'
			})
		}
		else {
			this.recaptchaRef.current.executeAsync()
			.then(res => {
				this.setState({
					recaptchaToken: res
				});
				
				this.recaptchaRef.current.reset();
				// console.log(res, "recaptchaToken");

				//	check if phone number is available
				axios.post('/isPhoneAvailable', {phone: this.state.phone})
				.then(res => {
					//	phone number is free to use
					if(res.status == 200){
						axios.post('/signupAccount', {
							phone: this.state.phone,
							password: this.state.password,
							name: this.state.name,
							surname: this.state.surname,
							email: this.state.email,
							recaptchaToken: this.state.recaptchaToken
						})
						.then(res => {
							if(res.status == 200){
								this.setState({
									resultError: 'Nowe konto zostało utworzone! Na podany numer telefonu został wysłany kod aktywacyjny.'
								})
								setTimeout(() => {location.href = '/activate'}, 3*1000);
							}
							else{
								this.setState({
									resultError: 'Wystąpił błąd podczas tworzenia konta. Proszę spróbować później.'
								})
							}
						})
						.catch(err => {
							console.error(err);
				
							this.setState({
								resultError: err.message
							})
						});
					}
					else {
						this.setState({
							resultError: "Ten numer telefonu został już wykorzystany przy rejestracji."
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
					<title>Nowa Ty - Salon urody :: Rejestracja konta</title>
					<link rel="icon" href="/favicon.ico" />

					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<meta charSet='utf-8' />

					{/* https://stackoverflow.com/a/33193739 */}
					<meta name="theme-color" content="#19606B" />
					<meta name="msapplication-navbutton-color" content="#19606B" />
					<meta name="apple-mobile-web-app-status-bar-style" content="#19606B" />
				</Head>
				
				<div className='wrapper'>
					<a href='/'><img className='logo' src='/img/logo.jpg' alt='logo' title='Powrót na stronę główną' /></a>
					<form onSubmit={this.handleSubmit}>
						<p className='errors'>{this.state.resultError}</p>
						<br />
						<div className='inputs'>
							<div className='account-data'>
								<label>
									Numer telefonu: <span className='required'>*</span><br />
									<input name='phone' type='text' value={this.state.phone} onChange={this.handleChange} required autoComplete='off' />
								</label>
								<br />
								<label>
									Hasło: <span className='required'>*</span><br />
									<input name='password' type='password' value={this.state.password} onChange={this.handleChange} required autoComplete='off' />
								</label>
								<br />
								<label>
									Powtórz hasło: <span className='required'>*</span><br />
									<input name='passwordagain' type='password' value={this.state.passwordagain} onChange={this.handleChange} required autoComplete='off' />
								</label>
							</div>
							<div className='person-data'>
								<label>
									Imię: <span className='required'>*</span><br />
									<input name='name' type='text' value={this.state.name} onChange={this.handleChange} required autoComplete='off' />
								</label>
								<br />
								<label>
									Nazwisko: <span className='required'>*</span><br />
									<input name='surname' type='text' value={this.state.surname} onChange={this.handleChange} required autoComplete='off' />
								</label>
								<br />
								<label>
									E-mail: <br />
									<input name='email' type='email' value={this.state.email} onChange={this.handleChange} autoComplete='off' />
								</label>
							</div>
						</div>
						<div className='buttons'>
							<small><span className='required'>* - pola obowiązkowe</span></small>
							<br /><br />
							<Button href='' type='submit'>
								Załóż nowe konto
							</Button>
						</div>
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
								background-image: url("/img/backgrounds/signup.jpg");
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
								padding-top: 10vh;
								background-color: rgba(#FFFFFF, .4);
								border-radius: 30px;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								font-size: .6em;

								.inputs {
									.account-data {
										margin-bottom: 5vh;
									}
								}

								.buttons {
									margin-top: 3vh;
									text-align: center;
								}

								@media (min-width:768px) {
									//	desktop
									padding: 4vw;
									width: 50vw;
									display: flex;
									flex-direction: column;

									.inputs {
										display: flex;
										flex-direction: row;

										div {
											margin: 3vw;
										}
									}
								}

								label {
									color: #000000;
									font-size: 1.2em;
								}

								input {
									font-size: .7em;
									padding: .5em 1em;
									margin-bottom: 1vh;
									border: 3px solid #CCCCCC;
									outline: none;
									transition-duration: .5s;

									:focus {
										border: 3px solid #000000;
									}
								}
							}
							.required {
								font-weight: bold;
								color: #FF0000;
							}
						}
					`}</style>
				</div>
			</>
		)
	}
}
