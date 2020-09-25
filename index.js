const OWIRobotArm = require('owi-robot-arm');
const WebSocket = require('ws');
const config = require('config');

const arm = new OWIRobotArm();
 
const wss = new WebSocket.Server({
  port: 8080
});

const commands =[
	'wristUp',
	'shoulderUp',
	'elbowUp',
	'wristDown',
	'shoulderDown',
	'elbowDown',
	'baseClockwise',
	'baseCounterClockwise',
	'gripsOpen',
	'gripsClose'
];

const blocked = config.get('blocked');

wss.on('connection', (ws) => {
	console.log('New connection Open');
	wss.on('message', (msg) => {
		const msgArray = msg.split(',');
		const command = msgArray[0];
		const user = msgArray[1];
		if (blocked.includes(user)) {
			console.log(`Blocking ${command} from ${user} because of config file.`);
		}
		if (!commands.includes(command) || !arm[command]) {
			console.log('Blocking invalid command');
			return;
		}
		arm[command]();
		console.log(`Running ${command} because ${user} said so`);
	});
});