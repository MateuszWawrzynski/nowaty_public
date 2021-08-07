import React, { useState, useEffect} from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";


const LoginInfo = () => {
	//	handle session
	const [ session, loading ] = useSession();

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
	
	return (
		<div className='wrapper'>
			{!loading && session ? (
			<>
				<span className='icon btnLogout' title='Kliknij, aby się wylogować' onClick={signOut}><FontAwesomeIcon icon={faSignOutAlt} /></span>
				<p>
					Zalogowano jako {`${session.user.name} ${session.user.surname}`}<br />
					{session.user.admin && <a href='/admin'><span>PANEL ADMINISTRATORA</span></a>}
				</p>
			</>
			):(
			<>
				<span className='icon btnLogin' title='Kliknij, aby się zalogować' onClick={signIn}><FontAwesomeIcon icon={faSignInAlt} /></span>
				<p>... lub <a href='/signup'><span>załóż nowe konto</span></a>!</p>
				<p>... lub <a href='/activate'><span>aktywuj nowo założone</span></a>!</p>
			</>
			)}

			<style jsx>{`
				.wrapper {
					position: fixed;
					top: 20%;
					right: 0%;
					transform: translateX(75%);
					z-index: 50;
					opacity: ${scrollY < 600 ? 1 : .25};

					width: 25vw;
					height: auto;
					padding: 3vh;
					background-color: #672E4A;
					cursor: default;

					font-size: .5em;
					text-align: center;
					color: white;

					transition-duration: .35s;
					transition-timing-function: ease-out;

					:hover {
						opacity: 1;
						transform: translateX(0%);
					}

					.icon {
						position: absolute;
						top: 40%;
						left: 8%;
						transform: translateY(-50%);
						font-size: 2em;
						cursor: pointer;
						transition-duration: .25s;

						:hover {
							color: #BBBBBB;
						}
					}
					.btnLogin:after {
						content: 'Zaloguj';
						position: absolute;
						top: 80%;
						left: 50%;
						transform: translateX(-50%);
						width: auto;
						height: auto;
						font-size: .4em;
					}
					.btnLogout:after {
						content: 'Wyloguj';
						position: absolute;
						top: 80%;
						left: 50%;
						transform: translateX(-50%);
						width: auto;
						height: auto;
						font-size: .4em;
					}

					p {
						margin: 0;
						margin-left: 15%;

						span {
							text-decoration: underline;
							cursor: pointer;
						}
					}
				}
			`}</style>
		</div>
	)
}

export default LoginInfo;