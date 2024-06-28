const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB service object
const instanceDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        const email = event.queryStringParameters.email; // email as a query parameter

        const params = {
            TableName: 'subscribedSongs',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        const data = await instanceDb.query(params).promise();
        const itemsWithImages = data.Items.map(item => {
            // Remove spaces from artist name and append .jpg to construct the image url
            const imageName = `${item.artist.replace(/\s/g, '')}.jpg`;
            item.imageUrl = `https://s3981218-artist-images.s3.amazonaws.com/${encodeURIComponent(imageName)}`;
            console.log(item.imageUrl);
            return item;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(itemsWithImages),
            headers: headers
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve data: ' + err.message }),
            headers: headers
        };
    }
};
