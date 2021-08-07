import React, { useState } from 'react'
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import { useSession } from 'next-auth/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhoneAlt, faMapMarkerAlt, faExternalLinkAlt, faFileWord, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import Button from '../Button'


const Contact = () => {
	//	load user session
	const [ session, loading ] = useSession();
	
	//	handle errors
	const [ resultSubmit, setResultSubmit ] = useState('');
	
	//	handle recaptcha
	const recaptchaRef = React.useRef();

	//	handle message
	const [ msg, setMsg ] = useState('');
	const handleChangeMsg = event => {
		setMsg(event.target.value)
	}
	
	//	handle form submit
	const handleSubmit = event => {
		event.preventDefault();
		
		//	clearing errors
		setResultSubmit('');

		recaptchaRef.current.executeAsync()
		.then(res => {
			recaptchaRef.current.reset();
			// console.log(res, "recaptchaToken");

			axios.post('/sendMessage', {
				mail: session.user.email,
				msg,
				recaptchaToken: res
			})
			.then(res => {
				// console.log(res);
	
				setMsg('');
				setResultSubmit(res.data.message);
			})
			.catch(err => {
				console.error(err);
				setResultSubmit(err.message);	
			});
		});
	}
	return (
		<div className='wrapper row'>
			<div className='socials col-12 col-md-4 offset-md-1'>
				<a href='tel:730197529' target='_blank'><FontAwesomeIcon icon={faPhoneAlt} /><span>+48 730 197 529</span></a>
				<a href='https://m.me/nowatysalonurody/' target='_blank'><FontAwesomeIcon icon={faFacebookMessenger} /><span>Messenger</span></a>
				<a href='mailto:nowaty.kontakt@gmail.com' target='_blank'><FontAwesomeIcon icon={faEnvelope} /><span>nowaty.kontakt@gmail.com</span></a>
			</div>
			<form className='col-10 offset-1 col-md-5 offset-md-1' onSubmit={handleSubmit}>
				{!loading ? (session ? (session.user.permissions.send_messages ? (
				<>
					<input type='hidden' name='mail' value={!loading && session && session.user.email} required readOnly={true} />
					<div className='form-group'>
						<label htmlFor="msg"><FontAwesomeIcon icon={faFileWord} /> &nbsp; Treść wiadomości</label>
						<textarea className='form-control' name='msg' value={msg} onChange={handleChangeMsg} rows='6' minLength='15' maxLength='200' required autoComplete='off'></textarea>
					</div>

					<ReCAPTCHA 
						sitekey={process.env.RECAPTCHA_TOKEN_PUBLIC} 
						size='invisible' 
						ref={recaptchaRef}
					/>

					<br />
					<div className='form-group'>
						<Button href='' type='submit'>
							Wyślij wiadomość
						</Button>
					</div>
					<br />
					<label htmlFor="btnSubmit">{resultSubmit}</label>
				</>
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Nie masz uprawnień do korzystania z formularza kontaktowego.</p>
					</div>
				)
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Aby skorzystać z formularza kontaktowego musisz się <a href='/signin'>zalogować</a>.</p>
					</div>
				)
				) : (<p>Ładowanie formularza...</p>)}
			</form>
			<div className='map col-12'>
				<div className='map-desktop'>
					<div className="embed-responsive embed-responsive-16by9">
						<iframe className="embed-responsive-item" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2425.8867200558702!2d19.686557716010842!3d52.55357394149258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471c7a79c1adec8b%3A0x157bfbe5d58ce7da!2sTysi%C4%85clecia%2010%2C%2009-400%20P%C5%82ock!5e0!3m2!1spl!2spl!4v1587227727186!5m2!1spl!2spl"></iframe>
					</div>
				</div>
				<div className='map-mobile'>
					<span className='icon'><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
					<br />
					<p>
						ul. Tysiąclecia 10 lok.36<br />
						09-400 Płock
						<br /><br /><br />
						<a href="https://maps.google.com/maps?ll=52.553571,19.688746&z=16&t=m&hl=pl&gl=PL&mapclient=embed&q=Tysi%C4%85clecia%2010%2009-400%20P%C5%82ock">Pokaż w aplikacji Google Maps&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt} /></a>
					</p>
				</div>
			</div>

			<style jsx>{`
				.wrapper {
					.socials {
						display: flex;
						flex-direction: row;
						justify-content: space-evenly;
						font-size: 4em;
						color: #FFFFFF;
						margin-bottom: 50px;

						@media (min-width:768px) {
							//desktop
							display: flex;
							flex-direction: column;
							justify-content: center;
							padding: 5vw;
							position: relative;
							background-color: #19606B;
							border-top: 5px solid #B84F82;
							color: #EEEEEE;
							font-size: 2em;

							::before {
								content: '';
								position: absolute;
								top: 1vh;
								left: 1vh;
								width: 100%;
								height: 100%;
								background-color: #19606B;
								z-index: -1;
							}
						}

						a {
							@media (min-width:768px) {
								//desktop
								display: flex;
								align-items: center;
								margin: 1.5vh 0;
								text-decoration: none;
								transition-duration: .3s;
							}
							
							span {
								display: none;

								@media (min-width:768px) {
									//desktop
									display: block;
									font-size: .4em;
									margin-left: 2vw;
								}
							}
						}
					}

					form {
						position: relative;
						padding: 5vh 5vw;
						background-color: #19606B;
						color: #EEEEEE;
						border-top: 5px solid #B84F82;
						margin-bottom: 60px;
						text-align: center;

						::before {
							content: '';
							position: absolute;
							top: 1vh;
							left: 1vh;
							width: 100%;
							height: 100%;
							background-color: #19606B;
							z-index: -1;
						}

						input,textarea {
							font-size: .8em;
							padding: .5em 1em;
							border: 3px solid #CCCCCC;
							outline: none;
							resize: none;
							transition-duration: .5s;

							:focus {
								border: 3px solid #000000;
							}
						}
					}

					.map {
						.map-desktop {
							display: none;

							@media (min-width:768px) {
								//desktop
								display: block;
								border: 1px solid black;
							}
						}

						.map-mobile {
							display: block;
							font-size: 1.1em;
							position: relative;
							padding: 3vh 30px;
							background-color: #19606B;
							text-align: center;
							color: #DDDDDD;

							::before {
								content: '';
								position: absolute;
								top: 1vh;
								left: 1vh;
								width: 100%;
								height: 100%;
								background-color: #19606B;
								z-index: -1;
							}

							@media (min-width:768px) {
								//desktop
								display: none;
							}

							.icon {
								font-size: 2.5em;
							}
						}
					}

					.errorBox {
						display: flex;
						flex-direction: column;
						text-align: center;

						span {
							font-size: 2em;
							margin: 2vh 0;
						}
					}
				}
			`}</style>
		</div>
	)
}

export default Contact;