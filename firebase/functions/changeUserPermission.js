const admin = require('firebase-admin');

const CryptoJS = require('crypto-js')
const tdes = require('crypto-js/tripledes')


exports.changeUserPermission = (request, response) => {
	//	dehash user id with daily secret key
	let dehashed_id = tdes.decrypt(request.body.userid, new Date().toLocaleDateString('en-US', {year:'numeric', month:'numeric', day:'numeric'}))
	dehashed_id = CryptoJS.enc.Utf8.stringify(dehashed_id)
	
	admin
		.firestore()
		.collection('accounts')
		.doc(dehashed_id)
		.set(request.body.perm, { merge: true })
		.then(res => {
			return response.status(200).json({
				message: "Permission changed successfully."
			});
		})
		.catch(err => {
			return response.status(500).json({
				message: "Error while changing the permission"
			});
		});	
}