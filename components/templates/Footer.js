import React from 'react'
import Socials from '../Socials'


const Footer = ({ background }) => {
	return (
		<footer className='wrapper container-fluid'>
			<div className='desc row'>
				<div className='col-8 offset-2'>
					<img className='logo' src='/img/logo.jpg' alt='logo' />
					<br />
					<span>
						Nowa Ty <br />
						Beata Pietrzak
					</span>
				</div>
			</div>
			<div className='socials row'>
				<div className='col-6 offset-3 col-md-2 offset-md-5'>
					<Socials dir='row' size='1.5em' />
				</div>
			</div>
			<div className='copyrights row'>
				<div className='col-8 offset-2'>
					<span>
						&copy; {new Date().getFullYear()}<br />
						Wszelkie prawa zastrzeżone
					</span>
				</div>
			</div>	

			<style jsx>{`
				.wrapper {
					position: relative;
					padding: 5vh 0;
					text-align: center;
					color: white;
					font-size: .5rem;
					border-top: 5px solid #B84F82;

					:before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: -1;
						background-image: url(${background});
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
						filter: brightness(.6);
					}

					.desc {
						margin-bottom: 2vh;
						font-size: 1.3em;

						.logo {
							width: 20vw;
							height: 20vw;
							max-width: 96px;
							max-height: 96px;
							margin-bottom: 2vh;
							border-radius: 90px;
						}
					}

					.socials {
						font-size: 1.6em;
					}

					.copyrights {
						margin-top: 2vh;
					}
				}
			`}</style>
		</footer>
	)
}

export default Footer;