const admin = require('firebase-admin');

exports.getEmployees = (request, response) => {
	admin
		.firestore()
		.collection('employees')
		.orderBy('employeeName')
		.get()
		.then(data => {
			let employees = [];
			data.forEach(item => {
				employees.push({
					id: item.id,
					...item.data()
				});
			});
			return response.status(200).json(employees);
		})
		.catch(err => {
			console.log(err);
		});
}