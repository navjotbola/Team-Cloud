import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify, { Interactions } from 'aws-amplify';
import config from "./config";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: config.cognito.REGION,
		userPoolId: config.cognito.USER_POOL_ID,
		identityPoolId: config.cognito.IDENTITY_POOL_ID,
		userPoolWebClientId: config.cognito.APP_CLIENT_ID
	},
	API: {
		endpoints: [
			{
				name: "api",
				endpoint: config.apiGateway.URL,
				region: config.apiGateway.REGION
			},
		]
	},
	Interactions: {
		bots: {
		  "PomaFocus": {
			"name": "Configure",
			"alias": "$LATEST",
			"region": config.cognito.REGION,
		  },
		}
	}
});

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();