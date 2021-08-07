const admin = require('firebase-admin');

exports.activateAccount = (request, response) => {
	admin
		.firestore()
		.collection('accounts')
		.where('phone', '==', request.body.phone)
		.where('activated', '==', request.body.code)
		.get()
		.then(res => {
			if(!res.empty){
				//	get document id
				let docId;
				res.forEach(item => docId = item.id)
				
				//	update the "activated" record in document
				admin
					.firestore()
					.collection('accounts')
					.doc(docId)
					.set({
						activated: "true"
					}, { merge: true })
					.then(res => {
						return response.status(200).json({
							message: "Account has been activated successfully."
						});
					})
					.catch(err => {
						return response.status(500).json({
							message: "Error while activating the account"
						});
					});
			}
			else{
				return response.status(202).json({
					message: "Account has NOT been activated."
				});
			}
		})
		.catch(err => {
			return response.status(500).json({
				message: "Error while activating the account",
				error: err.message
			});
		});
}