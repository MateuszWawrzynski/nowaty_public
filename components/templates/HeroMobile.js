import React, { useState } from 'react'

import { FontAwesomeIcon } 	from '@fortawesome/react-fontawesome'
import { faChevronDown } 	from '@fortawesome/free-solid-svg-icons'

import Socials 		from '../Socials'
import MenuMobile 	from '../MenuMobile'


const Hero = ({ background }) => {
	// https://stackoverflow.com/a/35537718
	const [ menuVisible, setMenuVisible ] = useState(false);
	const handleHamburgerClick = event => {
		setMenuVisible(!menuVisible);
	}
	
	return (
		<section className='wrapper'>
			<header className='header'>
				<img className='logo' src='/img/logo.jpg' alt='logo' />
				<button className='hamburger-menu' onClick={handleHamburgerClick}>
					<div className='hamburger-inner'></div>
					<div className='hamburger-inner'></div>
					<div className='hamburger-inner'></div>
				</button>
				<MenuMobile menuVisible={menuVisible} handler={handleHamburgerClick} />
			</header>
			<main className='content'>
				<h1 className='text'>
					NOWA TY<br />
					SALON URODY
				</h1>
				<div className='socials'>
					<Socials dir='row' size='2.5em' />
				</div>
			</main>
			<footer className='scroll-down'>	
				<FontAwesomeIcon icon={faChevronDown} onClick={() => {document.querySelector('#signin').scrollIntoView({behavior:'smooth'});}} />	
			</footer>

			<style jsx>{`
				.wrapper {
					width: 100vw;
					height: 100vh;
					padding: 40px 36px;
					font-size: 1rem;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

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
						filter: brightness(.25);
					}

					.header {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						
						.logo {
							width: 20vw;
							height: 20vw;
							max-width: 128px;
							max-height: 128px;
							border-radius: 90px;
							z-index: 99;
							position: ${menuVisible ? 'fixed' : 'block'};
							border: ${menuVisible ? '1px solid #DDD' : '0'};
							transform: ${menuVisible ? 'scale(1.5) translate(5vw, 3vw)' : 'scale(1) translateX(0)'};
							
							transition-duration: 0.25s;

							-webkit-box-shadow: 0px 0px 120px 30px rgba(255,255,255,1);
							-moz-box-shadow: 0px 0px 120px 30px rgba(255,255,255,1);
							box-shadow: 0px 0px 120px 30px rgba(255,255,255,1);
						}

						.hamburger-menu {
							width: 12.5vw;
							height: 12.5vw;
							max-width: 96px;
							max-height: 96px;
							background: none;
							border: 1px solid white;
							outline: none;
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							padding: 4%;

							.hamburger-inner {
								width: 100%;
								height: 5px;
								background-color: white;
								margin: 15% 5%;
							}
						}
					}
					.content {
						text-align: center;

						.text {
							font-size: 2em;
							color: white;
						}
						.socials {
							margin-top: 10vh;
						}
					}
				}
				
				.scroll-down {
					text-align: center;
					color: white;
					font-size: 2em;
					margin-top: 10vh;
					margin-bottom: 5vh;
					animation: 1s infinite alternate bounce;

					@keyframes bounce {
						from { transform: translateY(-5vh); }
						to { transform: translateY(0); }
					}
				}
			`}</style>
		</section>
	)
}

export default Hero;