

const pomafocusdev = {
	apiGateway: {
		REGION: "us-west-2",
		URL: "https://99tc53sae1.execute-api.us-west-2.amazonaws.com/dev"
	},
	cognito: {
		REGION: "us-west-2",
		USER_POOL_ID: "us-west-2_rfGWuBXbF",
		APP_CLIENT_ID: "6d3pufv80ujmp5v8oecobbijo4",
		IDENTITY_POOL_ID: "us-west-2:09d04c0b-65ad-45f0-a955-c7aaa9b9cd3b"
	},
	social: {
		FB: "2259819917380032",
		GOOGLE: "342197279641-91rss3lpgh46hmtkahm1v1rhum2cbn98.apps.googleusercontent.com",
		CALAPPKEY: "AIzaSyDPB1jNCQr1RGOaaLzWW6dFc1RprWOVUPg"
	}
};

const pomafocusprod = {
		apiGateway: {
		REGION: "us-west-2",
		URL: "https://vwmn6z782g.execute-api.us-west-2.amazonaws.com/prod"
	},
	cognito: {
		REGION: "us-west-2",
		USER_POOL_ID: "us-west-2_M31RGYuFS",
		APP_CLIENT_ID: "6dtbrf4j83ah4rsq8p5pj60a77",
		IDENTITY_POOL_ID: "us-west-2:af1ccf24-a3eb-4b6a-a70d-89556bb54f07"
	},
	social: {
		FB: "2259819917380032",
		GOOGLE: "342197279641-91rss3lpgh46hmtkahm1v1rhum2cbn98.apps.googleusercontent.com",
		CALAPPKEY: "AIzaSyDPB1jNCQr1RGOaaLzWW6dFc1RprWOVUPg"
	}
};


const config = process.env.REACT_APP_ENV === 'pomafocusprod'
	? pomafocusprod
	: pomafocusdev;	

export default {
	MAX_ATTACHMENT_SIZE: 5000000,
	...config
};
