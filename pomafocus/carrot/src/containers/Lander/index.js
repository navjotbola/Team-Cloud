import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

export default class Lander extends Component {
	render() {
		return (
			<div className="lander">
				<Jumbotron className="p-4 jumbotron-lander">
					<h2>Welcome to PomaFocus</h2>
					<p>The unique and highly efficient productivity manager</p>
					<div className="lander-feature">
						<div className="w-60 pull-left">
							<img src={process.env.PUBLIC_URL + '/manage.png'} alt="logo" />
						</div>
						<div className="w-40 pull-right">
							<hr/>
							<h4>Powerful task management views</h4>
							<p> Get meaningful task information to help you manage your projects </p>
							<hr/>
							<p> View realtime analytical data for projects you own </p>
							<hr/>
							<p> Easily view all your given tasks at any time </p>
						</div>
					</div>
					<div className="lander-feature">
						<div className="w-40 pull-left">
							<hr/>
							<h4>Real time scheduling</h4>
							<p> Dont know when to do your tasks? We'll take care of that for you </p>
							<hr/>
							<p> With PomaFocus, scheduling your day is as simple as adding a few tasks and clicking next</p>
						</div>
						<div className="w-60 pull-right">
							<img src={process.env.PUBLIC_URL + '/calandar.png'} alt="logo" />
						</div>
					</div>
					<div className="lander-feature">
						<div className="w-60 pull-left">
							<img src={process.env.PUBLIC_URL + '/timer.png'} alt="logo" />
						</div>
						<div className="w-40 pull-right">
							<hr/>
							<h4>In app notifications</h4>
							<p> Recieve notifications when a task should be started </p>
							<hr/>
							<p> When a task is about to start, you recieve a notification and can instantly start the timer </p>
						</div>
					</div>
				</Jumbotron>
			</div>
		);
	}
}