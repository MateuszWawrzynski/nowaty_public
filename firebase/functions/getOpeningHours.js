const admin = require('firebase-admin');

exports.getOpeningHours = (request, response) => {
	admin
		.firestore()
		.collection('openingHours')
		.get()
		.then(data => {
			let hoursArr = [];		
			if(request.body.date != undefined){
				//	when request.body.date is defined == get hours of one day
				data.forEach(item => {
					if(item.id == new Date(request.body.date).toLocaleDateString("en-US", {weekday: 'long'})){
						hoursArr.push({
							id: item.id,
							...item.data()
						})
					}
				});
			}
			else {
				//	when request.body.date is undefined == get all hours
				data.forEach(item => {
					hoursArr.push({
						id: item.id,
						...item.data()
					})
				});
			}
			return response.status(200).json(hoursArr);			
		})
		.catch(err => {
			response.status(500).json({
				message: 'Nie udało się pobrać danych o godzinach otwarcia. [#E004]',
				error: err.message
			});
			console.log(err);
		});
}