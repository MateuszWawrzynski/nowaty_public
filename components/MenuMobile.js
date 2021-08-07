import React from 'react'

import { signIn, signOut, useSession } from 'next-auth/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faCommentAlt, faCameraRetro, faComments, faTabletAlt, faTimes, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import OpeningHours from "../components/OpeningHours";


const MenuMobile = props => {
	const [ session, loading ] = useSession();
	
	const scroll = id => {
		document.querySelector(id).scrollIntoView({behavior:'smooth'});
	}

	return (
		<div className='wrapper'>
			<button className='btnCloseMenu' onClick={props.handler}><FontAwesomeIcon icon={faTimes} /></button>
			
			{!loading && session ? 
				<button className='btnSession btnLogout' onClick={signOut}><FontAwesomeIcon icon={faSignOutAlt} /></button> 
				: 
				<button className='btnSession btnLogin' onClick={signIn}><FontAwesomeIcon icon={faSignInAlt} /></button>
			}

			<div className='content'>
				<ul>
					<li onClick={() => {props.handler(); scroll('#signin')}}><FontAwesomeIcon icon={faCalendarPlus} /> &nbsp; Zapisz się na wizytę</li>
					<li onClick={() => {props.handler(); scroll('#contact')}}><FontAwesomeIcon icon={faCommentAlt} /> &nbsp; Skontaktuj się z nami</li>
					<li onClick={() => {props.handler(); scroll('#gallery')}}><FontAwesomeIcon icon={faCameraRetro} /> &nbsp; Galeria prac</li>
					<li onClick={() => {props.handler(); scroll('#comments')}}><FontAwesomeIcon icon={faComments} /> &nbsp; Opinie klientów</li>
					<br />
					{!loading && session && session.user.admin && (
						<li><FontAwesomeIcon icon={faTabletAlt} /> &nbsp; <a href='/admin'>PANEL ADMINISTRATORA</a></li>
					)}
				</ul>
				<OpeningHours mobile='true' />
			</div>

			<style jsx>{`
				.wrapper {
					width: 100vw;
					height: 100vh;
					background: -moz-linear-gradient(0deg, #B84F82 0%, #FF8AC3 100%);
					background: -webkit-linear-gradient(0deg, #B84F82 0%, #FF8AC3 100%);
					background: linear-gradient(0deg, #B84F82 0%, #FF8AC3 100%);
					position: fixed;
					top: 0;
					left: 0;
					z-index: 98;
					transform: translateX(${props.menuVisible ? '0' : '110%'});
					transition: transform 0.2s ease-out;
					display: flex;
					justify-content: center;
					align-items: center;

					.btnCloseMenu {
						position: absolute;
						top: 4vh;
						right: 4vh;
						
						width: 12.5vw;
						height: 12.5vw;
						max-width: 96px;
						max-height: 96px;

						background: none;
						border: 0;
						outline: none;

						font-size: 36px;
						font-weight: bold;
						color: white;

						transition-duration: 0.15s;

						:hover {
							transform: scale(1.5);
						}
					}

					.btnSession {
						position: absolute;
						top: 15vh;
						right: 4vh;
						
						width: 12.5vw;
						height: 12.5vw;
						max-width: 96px;
						max-height: 96px;

						background: none;
						border: 0;
						outline: none;

						font-size: 36px;
						font-weight: bold;
						color: white;

						transition-duration: .15s;
					}

					.btnLogin {
						animation: 2.5s infinite shake;
						@keyframes shake {
							0% { transform: rotate(0deg); }
							10% { transform: rotate(20deg); }
							20% { transform: rotate(-20deg); }
							25% { transform: rotate(15deg); }
							30% { transform: rotate(-10deg); }
							35% { transform: rotate(5deg); }
							40% { transform: rotate(0deg); }
						}

						:after {
							content: 'Zaloguj';
							position: absolute;
							top: 5vh;
							left: 50vw;
							transform: translateX(-50vw);
							width: auto;
							height: auto;
							font-size: .4em;
						}
					}

					.btnLogout {
						:after {
							content: 'Wyloguj';
							position: absolute;
							top: 5vh;
							left: 50vw;
							transform: translateX(-50vw);
							width: auto;
							height: auto;
							font-size: .4em;
						}
					}

					.content {
						height: 65%;
						margin-top: 35vh;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						ul {
							list-style-type: none;
							text-transform: uppercase;
							margin-left: 5vw;

							li {
								padding: .7vh 0;
								color: #EEE;
								font-size: .9em;
								cursor: pointer;
								transition-duration: 0.25s;

								:first-of-type {
									font-size: 1.1em;
									font-weight: bold;
									margin-bottom: 3vh;
								}
							}
						}
					}
				}
			`}</style>
		</div>
	)
}

export default MenuMobile;
