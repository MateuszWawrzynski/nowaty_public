import React, { Component } from 'react'
import axios from 'axios';


export default class Popup extends Component {
	constructor(props){
		super(props);
		this.state = {
			code: '',
			resultSubmit: '',
			refreshInfo: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		const name = event.target.name;
		this.setState({
			//	https://stackoverflow.com/a/30607466 + max 6 characters
			[name]: event.target.value.replace(/\D/g, "").slice(0, 6)
		});

		//	set button enabled only if code is typed
		if(event.target.value.replace(/\D/g, "").slice(0, 6).length == 6)
			document.querySelector("#btnSubmit").disabled = false;
		else
			document.querySelector("#btnSubmit").disabled = true;
	}

	handleSubmit(event){
		event.preventDefault();
		document.querySelector("#btnSubmit").disabled = 'true';

		//	clearing errors
		this.setState({
			resultSubmit: '',
			refreshInfo: false
		})

		axios.post('/checkConfirmCode', {code: this.state.code, phone: this.props.data.phone, hash: this.props.data.hashConfirmCode})
		.then(res => {
			if(res.status == 202){
				this.setState({
					code: '',
					resultSubmit: 'Podany przez Ciebie kod aktywacyjny jest niepoprawny.'
				});
				document.querySelector("#btnSubmit").disabled = false;
			}
			else {
				axios.post('/signInEvent', {
					surname: this.props.data.surname,
					phone: this.props.data.phone,
					service: this.props.data.service,
					duration: this.props.data.duration,
					employee: this.props.data.employee,
					subcalendarID: this.props.data.subcalendarID,
					date: this.props.data.date,
					recaptchaToken: this.props.data.recaptchaToken
				})
				.then(res => {
					// console.log(res);
				
					this.setState({
						code: '',
						resultSubmit: res.data.message,
						refreshInfo: true
					})

					setTimeout(() => {location.reload()}, 3*1000);
				})
				.catch(err => {
					console.error(err);
				
					this.setState({
						resultSubmit: err.message
					});
					document.querySelector("#btnSubmit").disabled = false;
				});
			}
		})
		.catch(err => {
			console.error(err);
		
			this.setState({
				resultSubmit: err.message
			});
			document.querySelector("#btnSubmit").disabled = false;
		});
	}
	
	render() {
		return (
			this.props.visible == 'true' ? <>
				<div className='popup_bg'></div>
				<div className='popup'>
					<img className='logo' src='../img/logo.jpg' alt='logo' />
					<br/><br/>
					<h1>
						Aby potwierdzić zamiar rezerwacji, proszę Cię o wpisanie poniżej 
						<br/><br/>
						<u>6-cio cyfrowego kodu aktywacyjnego, </u>
						<br/><br/>
						który został do Ciebie wysłany na podany przez Ciebie wcześniej numer telefonu:
					</h1>
					<br/>
					<h1><b>Zamknięcie tego okna oznacza anulowanie rezerwacji!</b></h1>
					<br/>
					<form className='' onSubmit={this.handleSubmit}>
						<div className='form-group'>
							<input type='text' className='form-control' name='code' value={this.state.code} onChange={this.handleChange} required autoComplete='off'/>
							<label htmlFor="btnSubmit">
								{this.state.resultSubmit}<br/>
								{this.state.refreshInfo ? 'Strona zostanie odświeżona za 3 sekundy...' : ''}
							</label>
						</div>
						<input type="submit" id='btnSubmit' name='btnSubmit' value="Potwierdź rezerwację" disabled />
					</form>
				</div>

				<style jsx>{`
					.popup_bg {
						position: fixed;
						top: 0;
						left: 0;
						width: 100vw;
						height: 100vh;
						background-color: rgba(0, 0, 0, 0.9);
						z-index: 10;
					}

					.popup {
						position: fixed;
						top: 5%;
						left: 25%;
						width: 50vw;
						min-height: 60%;
						background-color: #fff;
						z-index: 11;
						padding: 5vw;
						font-size: 1rem;
						text-align: center;

						img {
							width: 8vw;
							height: auto;
						}

						h1 {
							font-size: .6em;
						}

						form {
							display: inline-block;
							height: auto;

							.form-group{
								margin: 0;
							}

							input {
								font-size: .55em;
								margin-bottom: 10px;
							}

							label {
								font-size: .5em;
							}
						}
					}

					@media (max-width:768px) {
						.popup {
							top: 5%;
							left: 15%;
							width: 70vw;
						}
					}
				`}</style>
			</>:''
		)
	}
}
