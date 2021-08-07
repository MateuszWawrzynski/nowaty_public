const admin = require('firebase-admin');

exports.checkCredentials = (request, response) => {
	admin
		.firestore()
		.collection('accounts')
		.where('phone', '==', request.body.phone)
		.where('password', '==', request.body.password)
		.get()
		.then(res => {
			let account;
			res.forEach(item => {
				account = {
					id: item.id,
					email: item.data().email,
					name: item.data().name,
					surname: item.data().surname,
					admin: item.data().admin,
					activated: item.data().activated,
					permissions: {
						signin_events: item.data().perm_signin_events,
						send_messages: item.data().perm_send_messages,
						add_comments: item.data().perm_add_comments
					}
				};
			});
			
			return response.status(!res.empty ? 200 : 202).json({
				result: !res.empty,
				info: account
			});
		})
		.catch(err => {
			return response.status(500);
		});
}