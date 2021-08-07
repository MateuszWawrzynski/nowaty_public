const sha1 = require('crypto-js/sha1');
const md5 = require('crypto-js/md5');


exports.checkConfirmCode = (request, response) => {
	//	generate hash from data by the same method
	const generatedHash = sha1(md5(request.body.code + request.body.phone)).toString();

	//	compare generated now hash with received hash
	if(generatedHash == request.body.hash){
		response.status(200).json({
			message: "Code accepted"
		});
	}
	else {
		response.status(202).json({
			message: "Wrong code"
		});
	}
}