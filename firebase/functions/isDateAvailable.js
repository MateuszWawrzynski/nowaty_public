const credentials = require('./credentials.js');

const axios = require('axios');
axios.defaults.baseURL = credentials.firebase.apiURL;


exports.isDateAvailable = (request, response) => {
	//	check if its saving daylight time - https://stackoverflow.com/a/11888430/14536846
	Date.prototype.stdTimezoneOffset = function () {
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}	
	Date.prototype.dst = function () {
		return (this.getTimezoneOffset() < this.stdTimezoneOffset()) ? 1 : 0;
	}
	
	let pickedDate = new Date(request.body.date);
	// console.log('request.body.date', request.body.date)
	// console.log('request.body.duration', request.body.duration)
	// console.log('pickedDate', pickedDate.dst())

	let dateEventStart = pickedDate.getTime() + ((1+pickedDate.dst())*60*60*1000);	//(+1hour timezone + ?dst) * 60minutes * 60seconds * 1000miliseconds
	// console.log('dateEventStart', dateEventStart)
	dateEventStart = new Date(dateEventStart).toISOString().slice(0, 16);
	
	let dateEventEnd = pickedDate.getTime() + (((1+pickedDate.dst())*60 + request.body.duration)*60*1000);	//start time + event duration
	// console.log('dateEventEnd', dateEventEnd)
	dateEventEnd = new Date(dateEventEnd).toISOString().slice(0, 16);

	let subcalendarID = request.body.subcalendarID;
	
	let data = {
		header: {
			headers: {
				"Teamup-Token": credentials.teamup.teamupAPIKey,
				"Content-type": 'application/json'
			}
		}
	};

	// console.log(data);
	axios.get(`https://api.teamup.com/${credentials.teamup.calendarAdminID}/events?startDate=${dateEventStart}&endDate=${dateEventEnd}&subcalendarId[]=${subcalendarID}`, data.header)
	.then(res => {
		// console.log(res.data.events)
		
		let flag = true;
		res.data.events.forEach(item => {
			//	going through all events and set flag to false when selected date is overlaping
			if((new Date(dateEventStart) < new Date(item.start_dt) && new Date(dateEventEnd) <= new Date(item.start_dt)) ||
				(new Date(dateEventStart) >= new Date(item.end_dt) && new Date(dateEventEnd) >= new Date(item.end_dt)))
				{ /* continue loop when no overlaping */ }
				else flag = false;
		});
		return flag ? (response.status(200).json({message: "Date available"})) : (response.status(202).json({message: "Date NOT available"}));
	})
	.catch(err => {
		response.status(500).json({
			message: "Wystąpił błąd podczas próby wysłania formularza. Spróbuj ponownie później. [#E005]",
			error: err.message
		});
	});
}