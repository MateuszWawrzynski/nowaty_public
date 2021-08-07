import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import { useSession } from 'next-auth/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faFileWord } from '@fortawesome/free-solid-svg-icons';

import Button from "../Button";
import Comment from "../Comment";


const Comments = () => {
	//	load user session
	const [ session, loading ] = useSession();

	//	handle errors
	const [ resultSubmit, setResultSubmit ] = useState('');

	//	handle recaptcha
	const recaptchaRef = React.useRef();

	//	handle message
	const [ msg, setMsg ] = useState('');
	const handleChangeMsg = event => {
		setMsg(event.target.value)
	}
	
	//	load comments list
	const [ commentsList, loadCommentsList ] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('/getComments');
			loadCommentsList(result.data);
		};
		fetchData();
	}, []);

	
	const handleSubmit = event => {
		event.preventDefault();
		
		//	clearing errors
		setResultSubmit('');

		recaptchaRef.current.executeAsync()
		.then(res => {
			recaptchaRef.current.reset();
			// console.log(res, "recaptchaToken");

			axios.post('/addComment', {
				nick: `${session.user.name} ${session.user.surname}`,
				msg,
				date: new Date().toISOString(),
				recaptchaToken: res
			})
			.then(res => {
				// console.log(res);

				setMsg('');
				setResultSubmit(res.data.message);
			})
			.catch(err => {
				console.error(err);
				setResultSubmit(err.message);	
			});
		});
	}

	return (
		<div className='wrapper row'>
			<form className='add-comment col-10 offset-1 col-md-8 offset-md-2' onSubmit={handleSubmit}>
				{!loading ? (session ? (session.user.permissions.add_comments ? (
				<>				
					<div className='form-group'>
						<label htmlFor="msg"><FontAwesomeIcon icon={faFileWord} /> &nbsp; Napisz komentarz</label>
						<textarea className='form-control' name='msg' value={msg} onChange={handleChangeMsg} rows='4' minLength='15' maxLength='250' required autoComplete='off'></textarea>
					</div>

					<ReCAPTCHA 
						sitekey={process.env.RECAPTCHA_TOKEN_PUBLIC} 
						size='invisible' 
						ref={recaptchaRef}
					/>

					<br />
					<Button href='' type='submit'>
						Dodaj komentarz
					</Button>
					<br />
					<label htmlFor="btnSubmit">{resultSubmit}</label>
				</>
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Nie masz uprawnień do dodwania nowych komentarzy.</p>
					</div>
				)
				) : (
					<div className='errorBox'>
						<span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
						<p>Aby dodać nowy komentarz musisz się <a href='/signin'>zalogować</a>.</p>
					</div>
				)
				) : (<p>Ładowanie formularza...</p>)}
			</form>
			<div className='container-fluid'>
				<div className='comments row'>
					{commentsList.map(i => (
						<Comment key={i.id} nick={i.author} date={i.addDate._seconds} msg={i.content} />
					))}
				</div>
			</div>

			<style jsx>{`
				.wrapper {
					form {
						position: relative;
						padding: 5vh 5vw;
						background-color: #19606B;
						color: #EEEEEE;
						border-top: 5px solid #B84F82;
						margin-bottom: 60px;
						text-align: center;

						::before {
							content: '';
							position: absolute;
							top: 1vh;
							left: 1vh;
							width: 100%;
							height: 100%;
							background-color: #19606B;
							z-index: -1;
						}

						input,textarea {
							font-size: .8em;
							padding: .5em 1em;
							border: 3px solid #CCCCCC;
							outline: none;
							resize: none;
							transition-duration: .5s;

							:focus {
								border: 3px solid #000000;
							}
						}
					}

					.errorBox {
						display: flex;
						flex-direction: column;
						text-align: center;

						span {
							font-size: 2em;
							margin: 2vh 0;
						}
					}
				}
			`}</style>
		</div>
	)
}

export default Comments;