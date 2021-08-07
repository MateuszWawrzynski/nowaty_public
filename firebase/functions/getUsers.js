const admin = require('firebase-admin');
const tdes = require('crypto-js/tripledes')


exports.getUsers = (request, response) => {
	admin
		.firestore()
		.collection('accounts')
		.orderBy('surname')
		.get()
		.then(data => {
			let accounts = [];
			data.forEach(item => {
				//	response only hashed user ids - everyday the secret key changes
				let hashed_id = tdes.encrypt(item.id, new Date().toLocaleDateString('en-US', {year:'numeric', month:'numeric', day:'numeric'})).toString();
				accounts.push({
					id: hashed_id,
					user: `${item.data().name} ${item.data().surname}`,
					permissions: {
						signin_events: item.data().perm_signin_events,
						send_messages: item.data().perm_send_messages,
						add_comments: item.data().perm_add_comments
					}
				});
			});
			return response.status(200).json(accounts);
		})
		.catch(err => {
			console.log(err);
		});
}