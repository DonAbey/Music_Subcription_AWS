const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB service object
const instanceDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        console.log("HTTP Method:", event.httpMethod); //for debugging
        switch (event.httpMethod) {
            case "POST":
                let requestJSON = JSON.parse(event.body);
                const { email, username, password } = requestJSON;

                var params = {
                    TableName: "login",
                    Key: { "email": email }
                };

                // query - check if the user already exists
                const data = await instanceDb.get(params).promise();

                if (data.Item) {
                    body = { message: "The email already exists." };
                    statusCode = 409; // Conflict
                } else {
                    // Register new user
                    params = {
                        TableName: "login",
                        Item: {
                            "email": email,
                            "user_name": username,
                            "password": password
                        }
                    };
                    await instanceDb.put(params).promise();
                    body = { message: "Registration successful. Please login to continue." };
                }
                break;
            default:
                body = { message: `Unsupported method "${event.httpMethod}"` };
                statusCode = 400;
        }
    } catch (err) {
        console.error("Error:", err);
        statusCode = 500;
        body = { error: err.message };
    }

    return {
        statusCode,
        body: JSON.stringify(body),
        headers
    };
};
