import React from 'react'
import axios from 'axios'


const ASendMessageToAll = () => {
	const sendMessageToAll = msgtype => {
		let msg = document.querySelector('#msg').value;
		
		axios.post('/sendMessageToAll', {msgtype, msg})
		.then(res => {
			alert('Pomyślnie wysłano wiadomość do wszystkich użytkowników.');
		})
		.catch(err => {
			alert('Wystąpił błąd podczas próby wysłania wiadomości do wszystkich użytkowników.');
			console.error(err);
		})
	}
	
	return (
		<div className='container'>
			<p>Wiadomość do wszystkich użytkowników</p>
			<textarea id='msg' rows='5' maxLength='250'></textarea>		
			<div>
				<span>Wyślij za pomocą: </span>
				<br />
				<span className='option' onClick={() => {sendMessageToAll('sms')}}>📱 SMS</span> 
				&nbsp; | &nbsp;
				<span className='option' onClick={() => {sendMessageToAll('email')}}>📧 E-mail</span>
			</div>

			<style jsx>{`
				.container {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 5vh 0;
					padding: 3vh 5vw;
					background-color: rgba(#FFFFFF, .5);
					border-radius: 30px;
					color: #000000;
					font-size: .8em;

					@media (min-width:768px) {
						//desktop
						margin: 5vh 15vw;
					}

					p {
						margin: 5px;
					}

					#msg {
						margin-bottom: 1vh;
						width: 70%;
						border: 4px solid black;
						font-size: .5em;
						resize: none;
					}

					div {
						text-align: center;
						font-size: .8em;
						
						.option:hover {
							cursor: pointer;
							text-decoration: underline;
						}
					}
				}
			`}</style>
		</div>
	)
}

export default ASendMessageToAll;