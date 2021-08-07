import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const Comment = ({ nick, date, msg }) => {	
	return (
		<div className='wrapper col-12 col-md-6 col-lg-4 col-xl-3'>
			<h1 className='header'>
				<span className='icon'><FontAwesomeIcon icon={faUser} /></span>
				<span className='nick'>{nick}</span>
				<br />
				<small className='date'>{new Date(date*1000).toLocaleString()}</small>
			</h1>
			<p className='content'>{msg}</p>

			<style jsx>{`
				.wrapper {
					box-sizing: border-box;
					padding: 0;
					background-color: #19606B;
					border-top: 3px solid #B84F82;
					border-left: 1px solid #B84F82;
					border-right: 1px solid #B84F82;
					margin-bottom: 2vh;

					.header {
						font-size: 1.6em;
						padding: 2% 5%;
						backdrop-filter: brightness(.8);
						color: #FFFFFF;

						.icon {
							color: #E0AC69;
						}

						.nick {
							font-size: .7em;
							margin-left: 15px;
						}

						.date {
							font-size: .4em;
						}
					}

					.content {
						font-size: .7em;
						padding: 2% 5%;
						word-break: break-all;
						color: #DDDDDD;
					}
				}
			`}</style>
		</div>
	)
}

export default Comment;