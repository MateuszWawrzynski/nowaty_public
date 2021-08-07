import React, { useState, useEffect } from 'react'
import axios from 'axios'


const AUsersList = () => {
	//	load users list
	const [ usersList, loadUsersList ] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('/getUsers');
			loadUsersList(result.data);
		};
		fetchData();
	}, []);

	const changePermission = (userid, perm) => {
		axios.post('/changeUserPermission', {userid, perm})
		.then(res => {
			alert(`Zmieniono uprawnienie dla użytkownika ${userid}`)
			location.reload()
		})
		.catch(err => {
			alert('Wystąpił błąd podczas próby zmiany uprawnienia.')
			console.error(err)
		})
	}

	const sendMessageToUser = (userid, msgtype) => {
		let msg = prompt(`Wpisz treść wiadomości ${msgtype} jaką chcesz wysłać do tego użytkownika`);
		if(msg){
			axios.post('/sendMessageToUser', {userid, msgtype, msg})
			.then(res => {
				alert(`Pomyślnie wysłano wiadomość ${msgtype}`)
			})
			.catch(err => {
				alert(`Wystąpił błąd podczas próby wysłania wiadomości ${msgtype}`)
				console.error(err)
			})
		}
	}
	
	return (
		<div className='container'>
			<p>Lista użytkowników ({usersList.length})</p>
			<table>
				<tbody>
					<tr>
						<td>Imię i nazwisko</td>
						<td>Uprawnienia użytkownika</td>
						<td>Wyślij wiadomość</td>
					</tr>
					{
						!usersList ? (<tr><td>Ładowanie danych...</td></tr>) : 
						usersList.map(i => 
							<tr key={i.id}>
								<td>{i.user}</td>
								<td>
									<span className='perm' onClick={() => {changePermission(i.id, {perm_signin_events: !i.permissions.signin_events})}}>
										{i.permissions.signin_events ? `✅` : `❌`} Rezerwacja terminów
									</span>
									<span className='perm' onClick={() => {changePermission(i.id, {perm_send_messages: !i.permissions.send_messages})}}>
										{i.permissions.send_messages ? `✅` : `❌`} Wysyłanie wiadomości
									</span>
									<span className='perm' onClick={() => {changePermission(i.id, {perm_add_comments: !i.permissions.add_comments})}}>
										{i.permissions.add_comments ? `✅` : `❌`} Dodawanie komentarzy
									</span>
								</td>
								<td>
									<span className='type' onClick={() => {sendMessageToUser(i.id, 'sms')}}>📱 SMS</span>
									&nbsp; | &nbsp;
									<span className='type' onClick={() => {sendMessageToUser(i.id, 'email')}}>📧 E-mail</span>
								</td>
							</tr>
						)
					}
				</tbody>
			</table>

			<style jsx>{`
				.container {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 5vh 0;
					padding: 5vh 0;
					background-color: rgba(#FFFFFF, .5);
					border-radius: 30px;
					color: #000000;

					@media (min-width:768px) {
						//desktop
						margin: 5vh 15vw;
					}

					p {
						margin: 5px;
					}

					table {
						width: 95%;
						font-size: .5em;
						border: 4px solid black;

						tr:first-of-type {
							font-size: 1.1em;
							font-weight: bold;
							background-color: #DDD;
							text-align: center;
						}

						td {
							border-left: 1px solid gray;
							border-bottom: 1px dashed gray;
							padding: 5px 10px;
							text-align: center;

							:first-of-type {
								padding: 10px 5px;
							}

							.perm {
								display: flex;

								@media (min-width:768px) {
									//desktop
									margin-left: 25%;
								}

								:hover {
									cursor: pointer;
									text-decoration: underline;
								}
							}

							.type:hover {
								cursor: pointer;
								text-decoration: underline;
							}
						}
					}
				}
			`}</style>
		</div>
	)
}

export default AUsersList;