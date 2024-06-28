const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

// Creating an instance of dynamoDB
const instanceDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Define headers for CORS
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        // Parse the JSON body from the event
        const { email, artist, title } = JSON.parse(event.body);

        // Defining the parameters for the delete operation
        const params = {
            TableName: 'subscribedSongs',
            Key: {
                'email': email,
                'song_id': `${artist}:${title}`
            }
        };


        await instanceDb.delete(params).promise();

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Subscription removed successfully.' }),
            headers
        };
    } catch (err) {

        console.error('Error:', err); // Log and return error response for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not remove subscription: ' + err.message }),
            headers
        };
    }
};
