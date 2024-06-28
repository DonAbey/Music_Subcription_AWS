//Reference - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
//Reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse


const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Create an instance of DynamoDB
const instanceDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Log the incoming event for debugging
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Initializing response headers for CORS
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        // Parse the incoming JSON request parameters
        const { email, artist, title, year } = JSON.parse(event.body);
        //sort key creation
        const song_id = `${artist}:${title}`;

        // DynamoDB put operation parameters
        const params = {
            TableName: 'subscribedSongs',
            Item: {
                'email': email, // Partition key
                'song_id': song_id, // Sort key for multiple item for same user email
                'artist': artist,
                'title': title,
                'year': year
            }
        };

        // Performing the put operation in DynamoDB
        await instanceDb.put(params).promise();

        // If successful, return a success message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Subscription successful' }),
            headers: headers
        };
    } catch (err) {
        // Log and return the error information
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not subscribe: ' + err.message }),
            headers: headers
        };
    }
};