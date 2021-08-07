import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { jsPDF } from 'jspdf'


const AEmployeesList = () => {
	//	load employees list
	const [ employeesList, loadEmployeesList ] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('/getEmployees');
			loadEmployeesList(result.data);
		};
		fetchData();
	}, []);

	const downloadEventsFile = employeeName => {
		//	generate pdf file of tomorrow planned events for employee
		axios.post('/getTomorrowEvents', {employee: employeeName})
		.then(res => {
			const doc = new jsPDF({
				orientation: 'portrait',
				unit: 'px',
				format: 'a4',
			});
			doc.addFont('./fonts/Raleway/Raleway-Regular.ttf', 'Raleway', 'normal')
			doc.setFont('Raleway', 'normal')
			
			const offsetX = 50;
			const offsetY = 50;
			let rowpx = 15;

			doc.setFontSize(22)
			doc.text(employeeName, offsetX, offsetY);
			
			let tmrw = new Date();
			tmrw.setDate(tmrw.getDate()+1)
			doc.setFontSize(16)
			doc.text(tmrw.toLocaleDateString(), offsetX, offsetY + (rowpx * 1))

			const tableCellWidth = 140;
			doc.line(offsetX, offsetY + (rowpx * 3), offsetX + 350, offsetY + (rowpx * 3))
			doc.text(`Godzina rezerwacji`, offsetX + (tableCellWidth * 0), offsetY + (rowpx * 4))
			doc.text(`Rodzaj usługi`, offsetX + (tableCellWidth * 1), offsetY + (rowpx * 4))
			
			doc.setFontSize(12)
			res.data.forEach((item, i) => {
				let startHour = new Date(item.date._seconds*1000)
				let endHour = new Date(startHour)
				endHour.setMinutes(endHour.getMinutes() + item.duration)
				
				doc.text(`${startHour.toLocaleTimeString()} - ${endHour.toLocaleTimeString()}`, offsetX + (tableCellWidth * 0), offsetY + (rowpx * (5 + i)))
				doc.text(item.service, offsetX + (tableCellWidth * 1), offsetY + (rowpx * (5 + i)))
			})

			doc.line(offsetX, offsetY + (rowpx * (6 + res.data.length)), offsetX + 350, offsetY + (rowpx * (6 + res.data.length)))

			doc.save(`plan-${employeeName}-${tmrw.toLocaleDateString()}.pdf`);
		})
		.catch(err => {
			alert('Wystąpił błąd podczas próby wygenerowania dokumentu.')
			console.error(err)
		})
	}
	
	const downloadHistoryFile = (employeeName, subcalendarID) => {
		//	generate pdf file of events done by employee last month
		axios.post('/getEmployeeEventsHistory', {subcalendarID})
		.then(res => {
			const doc = new jsPDF({
				orientation: 'portrait',
				unit: 'px',
				format: 'a4',
			});
			doc.addFont('./fonts/Raleway/Raleway-Regular.ttf', 'Raleway', 'normal')
			doc.setFont('Raleway', 'normal')
			
			const offsetX = 50;
			const offsetY = 50;
			let rowpx = 15;

			doc.setFontSize(22)
			doc.text(employeeName, offsetX, offsetY);

			let prevMonth = new Date();
			prevMonth.setMonth(prevMonth.getMonth()-1)
			doc.setFontSize(16)
			doc.text(prevMonth.toLocaleString('pl-PL', {month: 'long', year: 'numeric'}), offsetX, offsetY + (rowpx * 1))

			const tableCellWidth = 100;
			doc.line(offsetX, offsetY + (rowpx * 3), offsetX + 350, offsetY + (rowpx * 3))
			doc.text(`Dzień rezerwacji`, offsetX + (tableCellWidth * 0), offsetY + (rowpx * 4))
			doc.text(`Klient/ka`, offsetX + (tableCellWidth * 1), offsetY + (rowpx * 4))
			doc.text(`Rodzaj usługi`, offsetX + (tableCellWidth * 2), offsetY + (rowpx * 4))

			doc.setFontSize(12)
			res.data.events.forEach((item, i) => {
				let eventDate = new Date(item.start_dt).toLocaleDateString('pl-PL', {day: '2-digit', month: 'long', year: 'numeric'});
				let service = item.notes && item.notes.split('<br>')[2].slice(15);
				
				doc.text(eventDate, offsetX + (tableCellWidth * 0), offsetY + (rowpx * (5 + i)))
				doc.text(item.title || "Nie podano", offsetX + (tableCellWidth * 1), offsetY + (rowpx * (5 + i)))
				doc.text(service || "Nie podano", offsetX + (tableCellWidth * 2), offsetY + (rowpx * (5 + i)))
			})

			doc.line(offsetX, offsetY + (rowpx * (6 + res.data.events.length)), offsetX + 350, offsetY + (rowpx * (6 + res.data.events.length)))

			doc.save(`historia-${employeeName}-${prevMonth.toLocaleString('pl-PL', {month: '2-digit', year: 'numeric'})}.pdf`);
		})
		.catch(err => {
			alert('Wystąpił błąd podczas próby wygenerowania dokumentu.')
			console.error(err)
		})
	}
	
	return (
		<div className='container'>
			<p>Lista pracowników salonu ({employeesList.length})</p>
			<table>
				<tbody>
					<tr>
						<td>Imię i nazwisko</td>
						<td>Zaplanowane zlecenia</td>
						<td>Historia wykonanych zleceń</td>
					</tr>
					{
						!employeesList ? (<tr><td>Ładowanie danych...</td></tr>) : 
						employeesList.map(i => 
							<tr key={i.id}>
								<td>{i.employeeName}</td>
								<td className='download' onClick={() => downloadEventsFile(i.employeeName, i.subcalendarID)}>
									<FontAwesomeIcon icon={faDownload} />&nbsp;&nbsp;Pobierz dokument
								</td>
								<td className='download' onClick={() => downloadHistoryFile(i.employeeName, i.subcalendarID)}>
									<FontAwesomeIcon icon={faDownload} />&nbsp;&nbsp;Pobierz dokument
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
						}

						.download {
							cursor: pointer;

							:hover {
								text-decoration: underline;
							}
						}
					}
				}
			`}</style>
		</div>
	)
}

export default AEmployeesList;