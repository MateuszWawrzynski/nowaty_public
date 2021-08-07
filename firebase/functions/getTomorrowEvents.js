const admin = require('firebase-admin');

exports.getTomorrowEvents = (request, response) => {
	//	check if its saving daylight time - https://stackoverflow.com/a/11888430/14536846
	Date.prototype.stdTimezoneOffset = function () {
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}	
	Date.prototype.dst = function () {
		return (this.getTimezoneOffset() < this.stdTimezoneOffset()) ? 1 : 0;
	}
	
	admin
		.firestore()
		.collection('events')
		.where('employee', '==', request.body.employee)
		.get()
		.then(data => {
			//	tomorrowStart = 00:00 the next day
			let tomorrowStart = new Date();
			tomorrowStart.setDate(tomorrowStart.getDate() + 1);
			tomorrowStart.setHours(1 + tomorrowStart.dst(), 0, 0, 0);

			//	tomorrowEnd = 00:00 the very next day
			let tomorrowEnd = new Date();
			tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);
			tomorrowEnd.setHours(tomorrowEnd.dst(), 0, 0, 0);
			
			let events = [];
			data.forEach(item => {
				let eventDate = new Date(item.data().date._seconds*1000);
				if(eventDate >= tomorrowStart && eventDate < tomorrowEnd){
					events.push({
						...item.data()
					});
				}
			});
			return response.status(200).json(events);
		})
		.catch(err => {
			console.log(err);
		});
}