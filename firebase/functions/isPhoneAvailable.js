const admin = require('firebase-admin');

exports.isPhoneAvailable = (request, response) => {
	admin
		.firestore()
		.collection('accounts')
		.where('phone', '==', request.body.phone)
		.get()
		.then(res => {
			return response.status(res.empty ? 200 : 202).json({
				message: "Phone number is ready to use!"
			});
		})
		.catch(err => {
			return response.status(500).json({
				message: "Not available"
			});
		});
}