import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";

//creates preference
export async function create(event, context, callback) {
	const docClient = new AWS.DynamoDB.DocumentClient();
	const data = JSON.parse(event.body);
	const params = {
		TableName: process.env.preferncestableName,
		Item: {
			preferenceId: uuid.v1(),
			userId: event.requestContext.identity.cognitoIdentityId,
			pomodoroSize: data.pomodoroSize,
			shortBreakSize: data.shortBreakSize,
			longBreakSize: data.longBreakSize,
			workSchedule: data.workSchedule,
		}
	};
	try {
		await dynamoDbLib.call("put", params);
		const userparams = {
			TableName: process.env.userstableName,
			Key: {
				userId: event.requestContext.identity.cognitoIdentityId,
			},
			UpdateExpression: 'SET preferenceId = :preferenceId',
			ExpressionAttributeValues: {
			':preferenceId': params.Item.preferenceId
			},
		ReturnValues: 'UPDATED_NEW'
		}
		try {
			const result = await dynamoDbLib.call("update", userparams);
			console.log("entered try" + result);
			callback(null, success({ status: true }));
		} catch (e) {
			console.log(e);
			console.log("entered catch" + e);
			callback(null, failure({ status: false, error: "Preference update on user failed." }));
		}
		callback(null, failure({ status: true }));
	} catch (e) {
	callback(null, failure({ status: false })); }

}

//Fetches pref details based on the prefId specified
export async function retrieve(event, context, callback) {
	const params = {
		TableName: process.env.preferncestableName,
		Key: {
			preferenceId: event.pathParameters.id
		}
	};
	try {
		const result = await dynamoDbLib.call("get", params);
		if (result.Item) {
		// Return the retrieved item
		callback(null, success(result.Item));
		} else {
		callback(null, failure({ status: false, error: "Item not found."}));
		}
	} catch (e) {
	callback(null, failure({ status: false })); }
}

//Retrieves the user preference based on the user specified
export async function retrieveUserPreference(event, context, callback) {
    var userId;
    if(event.queryStringParameters && event.queryStringParameters.userId){
        userId = event.queryStringParameters.userId;
    } else {
        userId = event.requestContext.identity.cognitoIdentityId;
    }
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: process.env.preferncestableName,
		FilterExpression: '#userId = :userId',
		ExpressionAttributeNames: {
		'#userId': 'userId',
		},
		ExpressionAttributeValues: {
        ':userId': userId,
		},
	};
	try {
        const scanResult = await dynamoDb.scan(params).promise();
		if(scanResult){
			console.log(scanResult.Items);
			callback(null, success(scanResult));
        }else{
            callback(err,failure({ status: false , error: "Preferences not found" }));
        }
	} catch (e) {
		console.log(e);
		callback(null, failure({ status: false }));
    }
}

//Deletes preference based on the id specified
export async function deletePreference(event, context, callback) {

	const params = {
		TableName: process.env.preferncestableName,
		Key: {
			preferenceId: event.pathParameters.id
		},
		ReturnValues: 'ALL_OLD'
	};

	try {
		const result = await dynamoDbLib.call("delete", params);
		if(result.Attributes) {
		callback(null, success({ status: true }));
		} else {
			callback(null, failure({ status: false , error: "Unable to delete" }));
		}
	} catch (e) {
		console.log(e);
		callback(null, failure({ status: false }));
	}
}

//Updates the preferences of the user
export async function update(event, context, callback) {
	const data = JSON.parse(event.body);
    console.log(data);
	const docClient = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: process.env.preferncestableName,
		Key: {
			preferenceId: event.pathParameters.id
		},
		UpdateExpression: "SET pomodoroSize = :pomodoroSize, shortBreakSize = :shortBreakSize, longBreakSize = :longBreakSize, workSchedule = :workSchedule",
		ExpressionAttributeValues: {
                ":pomodoroSize": data.pomodoroSize,
                ":shortBreakSize": data.shortBreakSize,
                ":longBreakSize": data.longBreakSize,
                ":workSchedule": data.workSchedule,
			},

	};

	try {
		const result = await dynamoDbLib.call("update", params);
		callback(null, success({ status: true }));
	} catch (e) {
		console.log(e)
		callback(null, failure({ status: false }));
	}
}
