import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/client'

import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake, faFemale, faCalendarAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import Popup from '../Popup'
import Button from '../Button'


const SignIn = () => {
	//	load user session
	const [ session, loading ] = useSession();

	//	handle errors
	const [ resultSubmit, setResultSubmit ] = useState('');

	//	handle sms confirmation popup
	const [ confirmationPopup, setConfirmationPopup ] = useState('');
	const [ hashConfirmCode, setHashConfirmCode ] = useState('');

	//	handle recaptcha
	const recaptchaRef = React.useRef();
	const [ recaptchaToken, setRecaptchaToken ] = useState('')

	//	handle event duration
	const [ duration, setDuration ] = useState('')
	
	
	//	load services list
	const [ servicesList, loadServicesList ] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('/getServices');
			loadServicesList(result.data);
		};
		fetchData();
	}, []);

	//	load employees list
	const [ employeesList, loadEmployeesList ] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('/getEmployees');
			loadEmployeesList(result.data);
		};
		fetchData();
	}, []);


	//	handle date change
	const handleDateChange = event => {
		//	check if its saving daylight time - https://stackoverflow.com/a/11888430/14536846
		Date.prototype.stdTimezoneOffset = function () {
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		}	
		Date.prototype.dst = function () {
			return (this.getTimezoneOffset() < this.stdTimezoneOffset()) ? 1 : 0;
		}
		
		//	available start event time = HH:00 or HH:30
		let pickedDate = new Date(event.target.value);
		pickedDate.setHours(pickedDate.getHours()+1+pickedDate.dst());
		pickedDate.setMinutes(pickedDate.getMinutes() >= 30 ? 30 : 0);
		pickedDate = pickedDate.toISOString().slice(0, 16);
		event.target.value = pickedDate;
	}

	//	get employee's subcalendar id
	const [ subcalendarID, setSubcalendarID ] = useState();
	const handleEmployeeChange = event => {
		setSubcalendarID(employeesList.filter(i => i.employeeName == event.target.value)[0].subcalendarID);
	}


	//	handle form submit
	const { register, handleSubmit, errors } = useForm();
	const [ formData, setFormData ] = useState({});
	const onSubmit = data => {
		setFormData(data);
		setResultSubmit("")
		
		//	is user logged in
		if(!session){
			return setResultSubmit("Trzeba być zalogowanym, aby wysłać formularz.");
		}
		
		//	past date detection
		if(new Date(data.date).getTime() < Date.now() + 30 * 60 * 1000) {	// +30 minutes
			return setResultSubmit("Wybrany termin musi być przyszły o co najmniej 30 minut.");
		}

		//	employee is not selected
		if(!subcalendarID){
			return setResultSubmit("Nie wybrano pracownika.");
		}

		//	checking opening hours
		axios.post('/getOpeningHours', {date: data.date})
		.then(res => {
			res.data = res.data[0];

			let eventDuration = servicesList.filter(i => i.serviceName == data.service)[0].duration;
			setDuration(eventDuration)

			if(res.data.open > new Date(data.date).getHours() || res.data.close < new Date(data.date).getHours() + (new Date(data.date).getMinutes()/60) + (eventDuration/60)){
				if(res.data.open == 0 && res.data.close == 0){
					setResultSubmit("Salon jest w tym dniu nieczynny.")
				}
				else {
					setResultSubmit(`Godziny otwarcia w tym dniu to ${res.data.open}:00-${res.data.close}:00. Zarezerwuj termin w tych godzinach.`)
				}
			}
			else {
				axios.post('/isDateAvailable', {subcalendarID, date:data.date, duration:eventDuration})
				.then(res => {
					if(res.status == 202){
						setResultSubmit("Wybrany termin jest już zajęty lub czas usługi nachodzi na inny zarezerwowany termin.")
					}
					else {
						recaptchaRef.current.executeAsync()
						.then(res => {
							setRecaptchaToken(res)
							
							recaptchaRef.current.reset();
							// console.log(res, "recaptchaToken");

							//	generate code for client
							axios.post('/sendConfirmCode', {phone: data.phone})
							.then(res => {
								//	show the popup window
								setHashConfirmCode(res.data.hashConfirmCode)
								setConfirmationPopup('true')
								
								document.getElementById('calendar').scrollIntoView();
							})
							.catch(err => {
								console.error(err);
								setResultSubmit(err.message)
							});	
						})
						.catch(err => {
							console.error(err);
							setResultSubmit(err.message)
						});
					}
				})
			}
		})
		.catch(err => {
			console.error(err);
			setResultSubmit(err.message)	
		});
	};


	return (
		<div className='wrapper row'>
			<div className='calendar col-12 col-lg-8'>
				<iframe id='calendar' src={`https://teamup.com/${process.env.TEAMUP_CALENDAR_CLIENTID}?date=today&view=w&lang=pl&tz=Europe/Warsaw&showHeader=0&showProfileAndInfo=0&showSidepanel=0&disableSidepanel=1&showViewSelector=0&showMenu=0&weekStartDay=mo&showAgendaHeader=1&showAgendaDetails=0&showYearViewHeader=1${subcalendarID && ('&calendars=' + subcalendarID)}`} width="100%" height="635px"></iframe>
			</div>			
			<form className='col-10 offset-1 col-sm-8 offset-sm-2 col-lg-4 offset-lg-0' onSubmit={session && handleSubmit(onSubmit)}>
				{!loading ? (session ? (session.user.permissions.signin_events ? (
				<>
					<input type='hidden' name='surname' value={!loading && session && `${session.user.name} ${session.user.surname}`} ref={register()} />
					<input type='hidden' name='phone' value={!loading && session && session.user.phone} ref={register()} />
					<div className='form-group'>
						<label htmlFor="service"><FontAwesomeIcon icon={faHandshake} />&nbsp;Typ usługi</label>
						<select type='text' className='form-control' name='service' ref={register()} required>
							{servicesList.map(i => 
								<option key={i.id} value={i.serviceName}>{i.serviceName + ' (~' + i.duration + ' minut)'}</option>
							)}
						</select>
					</div>
					<div className='form-group'>
						<label htmlFor="employee"><FontAwesomeIcon icon={faFemale} />&nbsp;Pracownik</label>
						<select type='text' className='form-control' name='employee' onChange={handleEmployeeChange} ref={register()} required defaultValue=''>
							<option disabled value=''>-- Wybierz pracownika --</option>
							{employeesList.map(i => 
								<option key={i.id} value={i.employeeName}>{i.employeeName}</option>
							)}
						</select>
					</div>
					<br />
					<div className='form-group'>
						<label htmlFor="date"><FontAwesomeIcon icon={faCalendarAlt} />&nbsp;Termin wizyty</label>
						<input type='datetime-local' className='form-control' name='date' onChange={handleDateChange} ref={register()} required />
						<label htmlFor="date">{resultSubmit}</label>
					</div>

					<ReCAPTCHA 
						sitekey={process.env.RECAPTCHA_TOKEN_PUBLIC} 
						size='invisible' 
						ref={recaptchaRef}
					/>

					<div className='form-group'>
						<Button href='' type='submit'>
							Zapisz się
						</Button>
					</div>	
				</>
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Nie masz uprawnień do rezerwacji terminów online.</p>
					</div>
				)
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Aby skorzystać z opcji rezerwacji wizyty online musisz się <a href='/signin'>zalogować</a>.</p>
					</div>
				)
				) : (<p>Ładowanie formularza...</p>)}
			</form>

			<Popup visible={confirmationPopup} data={{...formData, subcalendarID, duration, hashConfirmCode, recaptchaToken}} />

			<style jsx>{`
				.wrapper {
					font-size: 1em;

					.calendar {
						margin-bottom: 50px;
						padding: 0;

						iframe {
							background-color: #19606B;
							-webkit-box-shadow: 10px 10px 0px 0px rgba(#19606B,1);
							-moz-box-shadow: 10px 10px 0px 0px rgba(#19606B,1);
							box-shadow: 10px 10px 0px 0px rgba(#19606B,1);
							border: 1px solid #19606B;
						}
					}

					form {
						position: relative;
						padding: 3vh 30px;
						background-color: #19606B;
						border-top: 5px solid #B84F82;
						color: #EEEEEE;

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

						.form-group {
							text-align: center;
						}

						input,select,button {
							font-size: .8em;
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
				}
			`}</style>
		</div>
	)
}

export default SignIn;