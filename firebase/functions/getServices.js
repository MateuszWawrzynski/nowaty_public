const admin = require('firebase-admin');

exports.getServices = (request, response) => {
	admin
		.firestore()
		.collection('services')
		.orderBy('serviceName')
		.get()
		.then(data => {
			let services = [];
			data.forEach(item => {
				services.push({
					id: item.id,
					...item.data()
				});
			});
			return response.status(200).json(services);
		})
		.catch(err => {
			console.log(err);
		});
}