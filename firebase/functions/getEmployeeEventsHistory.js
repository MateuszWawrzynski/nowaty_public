const credentials = require('./credentials.js');

const axios = require('axios');
axios.defaults.baseURL = credentials.firebase.apiURL;


exports.getEmployeeEventsHistory = (request, response) => {
	//	check if its saving daylight time - https://stackoverflow.com/a/11888430/14536846
	Date.prototype.stdTimezoneOffset = function () {
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}	
	Date.prototype.dst = function () {
		return (this.getTimezoneOffset() < this.stdTimezoneOffset()) ? 1 : 0;
	}
	
	let lastMonthStart = new Date();
	lastMonthStart = new Date(lastMonthStart.getTime() + ((1+lastMonthStart.dst())*60*60*1000));	//(+1hour timezone + ?dst) * 60minutes * 60seconds * 1000miliseconds
	lastMonthStart.setMonth(lastMonthStart.getMonth()-1, 1);
	lastMonthStart.setHours(1+lastMonthStart.dst(), 0, 0, 0);
	lastMonthStart = new Date(lastMonthStart).toISOString().slice(0, 16);
	// console.log(lastMonthStart, 'start')
	
	let lastMonthEnd = new Date(lastMonthStart);
	lastMonthEnd.setMonth(lastMonthEnd.getMonth()+1, 1);
	lastMonthEnd = new Date(lastMonthEnd).toISOString().slice(0, 16);
	// console.log(lastMonthEnd, 'end')
	
	let data = {
		header: {
			headers: {
				"Teamup-Token": credentials.teamup.teamupAPIKey,
				"Content-type": 'application/json'
			}
		}
	};

	// console.log(data);
	axios.get(`https://api.teamup.com/${credentials.teamup.calendarAdminID}/events?startDate=${lastMonthStart}&endDate=${lastMonthEnd}`, data.header)
	.then(res => {
		// console.log(res.data.events)

		let events = [];
		res.data.events.forEach(item => {
			if(item.subcalendar_id == request.body.subcalendarID)
				events.push(item)
		});
		
		return response.status(200).json({
			events: events
		});
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby wysłania formularza. Spróbuj ponownie później. [#E021]",
			error: err.message
		});
	});
}