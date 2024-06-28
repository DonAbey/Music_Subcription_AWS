const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// creating dynamodb instance
const instanceDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        // extracting parameters from query string
        const { artist, title, year } = event.queryStringParameters || {};


        // making sure artist is entered even though year or title is not entered
        // Reference - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        // Reference - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.FilterExpression.html
        let filterExpression = '#artist = :artist';
        let expressionAttributeValues = { ':artist': artist };
        let expressionAttributeNames = { '#artist': 'artist', '#title': 'title', '#year': 'year' };

        // appending conditions for the query using and operator
        if (title) {
            filterExpression += ' and contains(year_title, :title)';
            expressionAttributeValues[':title'] = title;
        }

        if (year) {
            filterExpression += ' and contains(year_title, :year)';
            expressionAttributeValues[':year'] = year;
        }

        const params = {
            TableName: 'music',
            ProjectionExpression: '#title, #artist, #year', // specifying which attributes to return
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };

        // Execute the scan operation on DynamoDB
        const data = await instanceDb.scan(params).promise();

        // Return the results or a no data found message
        if (data.Items.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(data.Items),
                headers
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No data found. Try again." }),
                headers
            };
        }
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch data: ' + err.message }),
            headers
        };
    }
};
