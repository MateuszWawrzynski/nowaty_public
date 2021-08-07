import React, { useState, useEffect} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";


const DotsMenu = () => {
	//	handle scroll event (for opacity)
	const [ scrollY, setScrollY ] = useState('');
	useEffect(_ => {
		const handleScroll = _ => { 
			setScrollY(window.scrollY)
		}
		window.addEventListener('scroll', handleScroll)
		return _ => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	//	scroll to dom element
	const scroll = (id) => {
		document.querySelector(id).scrollIntoView({behavior:'smooth'});
	}
	
	return (
		<>
			<ul className='nav'>		
				<li onClick={() => {scroll('#hero')}} title='Początek strony'><FontAwesomeIcon icon={faDotCircle} /></li>
				<li onClick={() => {scroll('#signin')}} title='Zapisz się na wizytę'><FontAwesomeIcon icon={faDotCircle} /></li>
				<li onClick={() => {scroll('#contact')}} title='Skontaktuj się z nami'><FontAwesomeIcon icon={faDotCircle} /></li>
				<li onClick={() => {scroll('#gallery')}} title='Galeria prac'><FontAwesomeIcon icon={faDotCircle} /></li>
				<li onClick={() => {scroll('#comments')}} title='Opinie klientów'><FontAwesomeIcon icon={faDotCircle} /></li>
			</ul>

			<style jsx>{`
				.nav {
					position: fixed;
					top: 40%;
					left: 0%;
					color: white;
					font-size: .4em;
					display: flex;
					flex-direction: column;
					z-index: 10;
					transition-duration: .25s;

					li {
						padding: .25vw;
						transition-duration: .25s;
						transform: translateX(${scrollY > 600 ? '50%' : '-100%'});

						:hover {
							cursor: pointer;
							color: #19606B;
						}

						:nth-child(1){ transition-delay: 0 }
						:nth-child(2){ transition-delay: .05s }
						:nth-child(3){ transition-delay: .1s }
						:nth-child(4){ transition-delay: .15s }
						:nth-child(5){ transition-delay: .2s }
					}
				}
			`}</style>
		</>
	)
}

export default DotsMenu;