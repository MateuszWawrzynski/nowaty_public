import React from 'react'

import Socials 		from '../Socials'
import OpeningHours from '../OpeningHours'
import LoginInfo 	from '../LoginInfo'
import DotsMenu 	from '../DotsMenu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faCommentAlt, faCameraRetro, faComments } from '@fortawesome/free-solid-svg-icons'


const Hero = ({ background }) => {
	const scroll = (id) => {
		document.querySelector(id).scrollIntoView({behavior:'smooth'});
	}
	
	return (
		<section id='hero' className='wrapper'>
			<header className='header'>
				<img className='logo' src='/img/logo.jpg' alt='logo' title='Nowa Ty - Salon urody' />
				<ul className='nav'>		
					<li onClick={() => {scroll('#contact')}}><FontAwesomeIcon icon={faCommentAlt} /> &nbsp; Skontaktuj się z nami</li>
					<li onClick={() => {scroll('#comments')}}><FontAwesomeIcon icon={faComments} /> &nbsp; Opinie klientów</li>
					<li onClick={() => {scroll('#gallery')}}><FontAwesomeIcon icon={faCameraRetro} /> &nbsp; Galeria prac</li>
					<li onClick={() => {scroll('#signin')}}><FontAwesomeIcon icon={faCalendarPlus} /> &nbsp; Zapisz się na wizytę</li>
				</ul>
			</header>
			<main className='content'>
				<p className='title'>
					Nowa Ty<br />
					Salon Urody
				</p>
			</main>
			<div className='socials'>
				<Socials dir='column' />
			</div>
			<div className='opening-hours'>
				<OpeningHours />
			</div>

			<LoginInfo />
			<DotsMenu />

			<style jsx>{`
				.wrapper {
					width: 100vw;
					height: 100vh;
					padding: 40px 36px;
					font-size: 1rem;

					:before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 100vw;
						height: 100vh;
						z-index: -1;
						background-image: url(${background});
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
						filter: brightness(.6) blur(3px);
						transform: scale(1.01);
					}
					
					.header {
						display: flex;
						flex-direction: row;
						justify-content: space-between;

						.logo {
							position: relative;
							width: 12.5vw;
							height: 12.5vw;
							max-width: 96px;
							max-height: 96px;
							border-radius: 90px;
							opacity: 0.9;
							transition-duration: 0.15s;
							cursor: pointer;

							-webkit-box-shadow: 0px 0px 120px 10px rgba(255,255,255,1);
							-moz-box-shadow: 0px 0px 120px 10px rgba(255,255,255,1);
							box-shadow: 0px 0px 120px 10px rgba(255,255,255,1);

							:hover {
								opacity: 1;
								transform: scale(1.3) translate(1vw, 1vw);
							}
						}

						.nav {
							li {
								color: white;
								font-size: .45em;
								text-transform: uppercase;
								position: relative;
								display: inline-block;
								margin-right: 20px;
								cursor: pointer;

								:last-of-type {
									margin-left: 15px;
									font-weight: bold;
									font-size: .5em;
								}

								::after {
									content: '';
									position: absolute;
									top: 20px;
									right: 0;
									width: 0;
									height: 2px;
									background-color: white;
									transition-duration: .25s;
									transition-timing-function: ease-out;
								}

								:hover ::after {
									width: 87%;
								}
							}
						}
					}

					.content {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-start;
						margin: 2vh auto;
						width: 50vw;
						height: 60vh;
						color: white;

						.title {
							width: 100%;
							font-size: 2em;
							line-height: .85em;
							font-family: 'SansitaSwashed';
							text-align: center;
							padding: 5vh;
							cursor: pointer;

							-webkit-box-shadow: 0px 0px 120px 10px #B84F82;
							-moz-box-shadow: 0px 0px 120px 10px #B84F82;
							box-shadow: 0px 0px 120px 10px #B84F82;

							background-color: rgba(#B84F82, 0.5);
							border-radius: 90px;					
						}
					}

					.socials {
						position: absolute;
						bottom: 5vh;
						left: 5vw;
					}

					.opening-hours {
						position: absolute;
						bottom: 2vh;
						right: 6vw;
					}
				}
			`}</style>
		</section>
	)
}

export default Hero;