import { API } from "aws-amplify";
import React, { Component } from "react";
import "./configure.css";
import config from "../../config";
import { ChatBot, AmplifyTheme } from 'aws-amplify-react';

const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#ff6600'
  }
};

export default class Configure extends Component {

	handleComplete(err, config) {
		if (err) {
		  alert('Configuration setup failed')
		  return;
		}
        var preference = { pomodoroSize: config.slots.pomodorosize,
                           shortBreakSize: config.slots.shortbreaksize,
                           longBreakSize: config.slots.longbreaksize,
                           workSchedule: { start: {},
                                           lunch: { start: {}, end: {} },
                                           end: {} } };

        preference.workSchedule.start = this.convertTimeString(config.slots.workstarttime);
        preference.workSchedule.end = this.convertTimeString(config.slots.workendtime);
        preference.workSchedule.lunch.start = this.convertTimeString(config.slots.lunchstarttime);
        preference.workSchedule.lunch.end = this.convertTimeString(config.slots.lunchendtime);

        this.setPreferences(preference).then(() => {
            console.log("done with bot");
        });

		return 'Configuration is complete! Start adding some tasks';
	}

    setPreferences = (preference) => {
        return this.getPreferences().then( (existing) => {
            if (existing.Count) {
                return API.put('api', `/api/preference/${existing.Items[0].preferenceId}`,
                            { body: preference });
            } else {
                return API.post('api', '/api/preference', { body: preference });
            }
        });
    }

    convertTimeString = (timestr) => {
        var splitStr = timestr.split(':');
        return { h: parseInt(splitStr[0]), m: parseInt(splitStr[1]) };
    }

    getPreferences = () => {
        return API.get('api', '/api/preference');
    }

	render() {
        const existingPreference = this.getPreferences();
        console.log("Existing", existingPreference);
		return (
			<div className="configure-container">
				<ChatBot
					title="Configuration helper"
					theme={myTheme}
					botName="PomaFocus"
					welcomeMessage="Welcome! My name is Poma, I will be helping you configure your accout. I will ask you several questions and setup your account preferences based on your answers. Shall we begin?"
					onComplete={this.handleComplete.bind(this)}
					clearOnComplete={true}
				/>
			</div>
		);
	}
}
