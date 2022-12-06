export const IPAddress = "192.168.1.12";
export const Localhost = "http://" + IPAddress + ":3000";

global.server = "http://" + IPAddress + ":3000/";

global.userData = {};
global.token = "";
global.deviceExpoPushToken = "";

global.notificationCount = 0;

global.isPhoneNumVerified = false;

global.selectedWorker = "";
global.serviceRequestPosted = false;
