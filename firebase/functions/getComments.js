const admin = require('firebase-admin');

exports.getComments = (request, response) => {
	admin
		.firestore()
		.collection('comments')
		.orderBy('addDate', 'desc')
		.limit(12)
		.get()
		.then(data => {
			let comments = [];
			data.forEach(item => {
				comments.push({
					id: item.id,
					...item.data()
				});
			});
			return response.status(200).json(comments);
		})
		.catch(err => {
			console.log(err);
		});
}