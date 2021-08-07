import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Section = ({ id, icon, title, desc, background, alpha, children }) => {
	return (
		<section id={id} className='wrapper container-fluid'>
			<header className='header row'>
				<div className='col-12'>
					<h1 className='title'><FontAwesomeIcon icon={icon} /><span>{title}</span></h1>
					<h2 className='desc'>{desc}</h2>
				</div>
			</header>
			<main>
				{children}
			</main>

			<style jsx>{`
				.wrapper {
					position: relative;
					min-height: 100vh;

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

					.header {
						margin-bottom: 50px;
						padding: 5vh 2vw;
						color: #FFFFFF;
						border-left: 1vw solid #19606B;
						backdrop-filter: brightness(.9);

						@media (min-width:768px) {
							//	desktop
							background-color: rgba(#19606B, .1);
							backdrop-filter: brightness(.8);
						}

						.title {
							font-size: 1.2rem;
							font-weight: bold;
							text-transform: uppercase;

							span {
								margin-left: 4vw;
							}
						}
						.desc {
							font-size: .7rem;
						}
					}

					main {
						padding: 5vh 3vw;
						padding-bottom: 30vh;
						font-size: .6rem;
						opacity: ${alpha};
					}
				}
			`}</style>
		</section>
	)
}

export default Section;