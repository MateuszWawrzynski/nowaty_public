import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faFacebookMessenger, faInstagram } from '@fortawesome/free-brands-svg-icons'


const Socials = ({ dir, size }) => {
	return (
		<div className='wrapper'>
			{/* https://medium.com/@PraveenPoonia/javascript-short-circuit-evaluation-f1d95edca3ec */}
			<a className={dir == 'column' && 'social-fb'} href='https://www.facebook.com/nowatysalonurody/' target='_blank'><FontAwesomeIcon icon={faFacebookSquare} /></a>
			<a className={dir == 'column' && 'social-msg'} href='https://m.me/nowatysalonurody/' target='_blank'><FontAwesomeIcon icon={faFacebookMessenger} /></a>
			<a className={dir == 'column' && 'social-ig'} href='https://www.instagram.com/nowa_ty_salon_urody/' target='_blank'><FontAwesomeIcon icon={faInstagram} /></a>

			<style jsx>{`
				.wrapper {
					display: flex;
					flex-direction: ${dir};
					justify-content: space-evenly;
					font-size: ${size};
					position: relative;

					a {
						color: white;
						position: relative;

						::after {
							position: absolute;
							top: 12%;
							left: 0;
							padding: 5px 10px;
							border-radius: 45px;
							font-size: .5em;
							opacity: 0;
							transition-duration: .35s;
						}

						:hover {
							transition-duration: .35s;
							transform: scale(1.2);
							
							::after {
								opacity: 1;
								transform: translateX(50%);

								-webkit-box-shadow: 0px 0px 80px 30px #B84F82;
								-moz-box-shadow: 0px 0px 80px 30px #B84F82;
								box-shadow: 0px 0px 80px 30px #B84F82;
							}
						}
					}
					.social-fb {	
						::after {
							content: 'Facebook';
						}
						:hover ::after {
							background-color: #3B5998;
						}
					}
					.social-msg {
						::after {
							content: 'Messenger';
						}
						:hover ::after {
							background-color: #0078FF;
						}
					}
					.social-ig {
						::after {
							content: 'Instagram';
						}
						:hover ::after {
							background-color: #E1306C;
						}
					}
				}
			`}</style>
		</div>
	)
}

export default Socials;