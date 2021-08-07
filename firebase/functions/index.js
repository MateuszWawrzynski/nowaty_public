const credentials = require('./credentials');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const app = require('express')();
const cors = require('cors');
app.use(cors());

//	===================

const { getServices } = require('./getServices');
app.get('/getServices', getServices);

const { getEmployees } = require('./getEmployees');
app.get('/getEmployees', getEmployees);

const { getOpeningHours } = require('./getOpeningHours');
app.post('/getOpeningHours', getOpeningHours);

const { isDateAvailable } = require('./isDateAvailable');
app.post('/isDateAvailable', isDateAvailable);


const { sendConfirmCode } = require('./sendConfirmCode');
app.post('/sendConfirmCode', sendConfirmCode);

const { checkConfirmCode } = require('./checkConfirmCode');
app.post('/checkConfirmCode', checkConfirmCode);

const { signInEvent } = require('./signInEvent');
app.post('/signInEvent', signInEvent);


const { sendNotifications } = require('./sendNotifications');
app.post('/sendNotifications', sendNotifications);


const { sendMessage } = require('./sendMessage');
app.post('/sendMessage', sendMessage);


const { getComments } = require('./getComments');
app.get('/getComments', getComments);

const { addComment } = require('./addComment');
app.post('/addComment', addComment);


const { checkCredentials } = require('./checkCredentials');
app.post('/checkCredentials', checkCredentials);

const { isPhoneAvailable } = require('./isPhoneAvailable');
app.post('/isPhoneAvailable', isPhoneAvailable);

const { signupAccount } = require('./signupAccount');
app.post('/signupAccount', signupAccount);

const { activateAccount } = require('./activateAccount');
app.post('/activateAccount', activateAccount);


const { getUsers } = require('./getUsers');
app.get('/getUsers', getUsers);

const { getTomorrowEvents } = require('./getTomorrowEvents');
app.post('/getTomorrowEvents', getTomorrowEvents);

const { getEmployeeEventsHistory } = require('./getEmployeeEventsHistory');
app.post('/getEmployeeEventsHistory', getEmployeeEventsHistory);

const { changeUserPermission } = require('./changeUserPermission');
app.post('/changeUserPermission', changeUserPermission);

const { sendMessageToUser } = require('./sendMessageToUser');
app.post('/sendMessageToUser', sendMessageToUser);

const { sendMessageToAll } = require('./sendMessageToAll');
app.post('/sendMessageToAll', sendMessageToAll);

//	===================

exports.api = functions.region('europe-west3').https.onRequest(app);