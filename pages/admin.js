import React from 'react'
import Head from 'next/head'

import { useSession } from 'next-auth/client'

import { FontAwesomeIcon } 	from '@fortawesome/react-fontawesome'
import { faArrowLeft } 		from '@fortawesome/free-solid-svg-icons'

import AEmployeesList 		from '../components/AEmployeesList'
import AUsersList 			from '../components/AUsersList'
import ASendMessageToAll 	from '../components/ASendMessageToAll'


const Admin = () => {
	const [ session, loading ] = useSession();
	return (
		<>
			<Head>
				<title>Nowa Ty - Salon urody :: Panel administratora</title>
				<link rel="icon" href="/favicon.ico" />

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta charSet='utf-8' />

				{/* https://stackoverflow.com/a/33193739 */}
				<meta name="theme-color" content="#19606B" />
				<meta name="msapplication-navbutton-color" content="#19606B" />
				<meta name="apple-mobile-web-app-status-bar-style" content="#19606B" />
			</Head>

			{!loading && session ? (session.user.admin ? (
				<div className='container'>
					<a href='/' className='btnBack' title='Wróć na stronę główną'>
						<FontAwesomeIcon icon={faArrowLeft} />
					</a>
					<h3>
						PANEL ADMINISTRATORA<br />
						<span>{session.user.name} {session.user.surname}</span>
						<hr />
					</h3>
					<div>
						<ASendMessageToAll />
						<AEmployeesList />
						<AUsersList />
					</div>

					<style jsx>{`
						.container {
							position: relative;
							width: 100vw;
							height: auto;
							padding: 10vh 0;
							color: white;

							:before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								z-index: -1;
								background-image: url("/img/backgrounds/admin.jpg");
								background-size: cover;
								background-repeat: no-repeat;
								background-position: center;
								filter: brightness(.6);
							}

							.btnBack {
								position: fixed;
								top: 3vw;
								left: 3vw;
							}

							h3 {
								width: 70vw;
								margin: 0 auto;
								text-align: center;

								span {
									font-size: .8em;
								}
							}

							div {
								margin: 10vh auto;
							}
						}
					`}</style>
				</div>
			) : (
				location.href = "/"
			)
			) : (<p>Ładowanie formularza...</p>)}
		</>
	)
}

export default Admin;