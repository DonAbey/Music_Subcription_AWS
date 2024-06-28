const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// creating an instance of dynamodb
const instanceDb = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2)); //debugging
    let body;
    let statusCode = 200;
    //Reference - https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        console.log("HTTP Method:", event.httpMethod); // Logging the method to debug
        switch (event.httpMethod) {
            case "POST":
                //passing the json body from the request
                let requestJSON = JSON.parse(event.body);
                const { email, password } = requestJSON;
                var params = {
                    TableName: "login", //table name
                    Key: { "email": email }
                };
                //query
                const data = await instanceDb.get(params).promise();

                if (data.Item && data.Item.password === password) {
                    body = {
                        //passing the username and email as a response - for mainpage functionality
                        message: "Login successful!",
                        userName: data.Item.user_name,
                        userEmail: data.Item.email
                    };
                } else {
                    //Reference - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
                    body = { message: "Login failed: Incorrect email or password." };
                    statusCode = 401;
                }
                break;
            default:
                body = { message: `Unsupported method "${event.httpMethod}"` };
                statusCode = 400;
        }
    } catch (err) {
        statusCode = 500;
        body = { error: err.message };
    }

    return {
        statusCode,
        body: JSON.stringify(body),
        headers
    };
};
