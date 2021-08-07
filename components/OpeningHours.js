import React, { Component } from 'react'
import axios from 'axios'


export default class OpeningHours extends Component {
	constructor(props){
		super(props);
		this.state = {
			openingHours: [],
			dataLoaded: false
		}
	}

	componentDidMount(){
		axios.post('/getOpeningHours')
		.then(res => {
			this.setState({
				openingHours: Object.values(res.data),
				dataLoaded: true
			}, 
			() => {
				// if opening and closing hour is 0 (closed whole day), then set to string
				document.querySelectorAll(`.wrapper-opening-hours li span`).forEach(v => {
					if(v.textContent.includes('0:00-0:00')) 
						v.textContent = 'zamknięte';
				})

				//	getDay() by default returns monday=0 sunday=6 ->> ((day + 6) % 7) + 1 ->> monday=1 sunday=7
				!this.props.mobile && document.querySelector(`.wrapper-opening-hours li:nth-of-type(${((new Date().getDay() + 6) % 7) + 1})`).classList.add('today');
			});
		})
		.catch(err => console.error(err));
	}

	// https://stackoverflow.com/a/61055910
	componentWillUnmount() {
		this.setState = () => { return };
	}
	
	render() {
		const { dataLoaded:dl, openingHours:h } = this.state;
		return (
			<ul className={`wrapper-opening-hours ${this.props.mobile && 'mobile'}`} title="Godziny otwarcia salonu">
				{/* if dl==true ->> openinghour of day:00-closinghour of day:00 */}
				<li>Poniedziałek<br /><span>{dl && h.filter(({id}) => id == 'Monday')[0].open}:00-{dl && h.filter(({id}) => id == 'Monday')[0].close}:00</span></li>
				<li>Wtorek		<br /><span>{dl && h.filter(({id}) => id == 'Tuesday')[0].open}:00-{dl && h.filter(({id}) => id == 'Tuesday')[0].close}:00</span></li>
				<li>Środa		<br /><span>{dl && h.filter(({id}) => id == 'Wednesday')[0].open}:00-{dl && h.filter(({id}) => id == 'Wednesday')[0].close}:00</span></li>
				<li>Czwartek	<br /><span>{dl && h.filter(({id}) => id == 'Thursday')[0].open}:00-{dl && h.filter(({id}) => id == 'Thursday')[0].close}:00</span></li>
				<li>Piątek		<br /><span>{dl && h.filter(({id}) => id == 'Friday')[0].open}:00-{dl && h.filter(({id}) => id == 'Friday')[0].close}:00</span></li>
				<li>Sobota		<br /><span>{dl && h.filter(({id}) => id == 'Saturday')[0].open}:00-{dl && h.filter(({id}) => id == 'Saturday')[0].close}:00</span></li>
				<li>Niedziela	<br /><span>{dl && h.filter(({id}) => id == 'Sunday')[0].open}:00-{dl && h.filter(({id}) => id == 'Sunday')[0].close}:00</span></li>

				<style jsx>{`
					.wrapper-opening-hours {
						display: flex;
						flex-direction: column;
						justify-content: space-evenly;
						align-items: flex-end;
						font-family: 'Lato';
						color: white;
						list-style-type: none;

						li {
							margin-top: 1.3vh;
							line-height: .8em;
							text-align: right;
							font-size: .6em;
							font-weight: bold;
							cursor: pointer;

							span {
								font-size: .7em;
								font-weight: normal;
								font-style: italic;
							}
						}

						.today {
							transform: scale(1.5) translateX(-1vw);
							padding: 2vh 0;
							font-weight: bold;
							position: relative;

							::before {
								content: '';
								position: absolute;
								top: 1vh;
								left: -1.5vw;
								z-index: -1;
								width: 200%;
								height: 70%;
								background-color: rgba(#B84F82, 0.2);
								border-radius: 90px;
							}
							::after {
								content: '<';
								position: absolute;
								top: 2.5vh;
								right: -1.5vw;
								color: #B84F82;
							}
						}
					}

					.mobile {
						flex-direction: row;
						flex-wrap: wrap;
						margin: 0;
						padding: 5vh 0;
						font-size: 1.4em;
						backdrop-filter: brightness(.6);
						
						li {
							margin: 1vh 5vw;
							text-align: center;
						}
					}
				`}</style>
			</ul>
		)
	}
}
