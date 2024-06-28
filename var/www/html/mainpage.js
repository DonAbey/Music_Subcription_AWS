//getting username from the current session after sucessful login
const userName = sessionStorage.getItem('userName');
document.getElementById('userName').textContent = userName;

//for displaying subscriptions - Initializing as the page loads
document.addEventListener('DOMContentLoaded', function() {
    const userEmail = sessionStorage.getItem('userEmail'); // Ensure userEmail is stored in sessionStorage
    fetchSubscriptions(userEmail);
});

//-----------------for query button-------------------------------
function queryMusic() {
    //getting values from the input fields
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const year = document.getElementById('year').value;

    //Initializing the url params for query
    //Reference: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    let queryParams = new URLSearchParams();
    if (title) queryParams.append('title', title);
    if (artist) queryParams.append('artist', artist);
    if (year) queryParams.append('year', year);

    fetch(`https://ksplvzo54b.execute-api.us-east-1.amazonaws.com/production/QueryButton?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            //passing data to the dislpayResults function
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error querying music data.');
        });
}

function displayResults(data) {
    const results = document.getElementById('query-results');
    results.innerHTML = ''; // Clear previous results
    if (data && data.length > 0) {
        //creating a new table in the container
        const table = document.createElement('table');
        table.style.width = '100%'; // ensuring the table uses full width
        const header = table.insertRow();
        //creating table header
        ['Title', 'Artist', 'Year', 'Action'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            header.appendChild(th);
        });

        //iterating each item and creating rows for each
        //Refernce - OpenAI
        data.forEach(item => {
            const row = table.insertRow();
            ['title', 'artist', 'year'].forEach(key => {
                const cell = row.insertCell();
                cell.textContent = item[key];
            });
            //adding subscribe button for each item
            const subscribeCell = row.insertCell();
            const subscribeButton = document.createElement('button');
            subscribeButton.textContent = 'Subscribe';
            subscribeButton.className = 'subscribe-button';
            //passing the item to subscribeMusic function to display subscribed songs
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
            subscribeButton.onclick = () => subscribeMusic(item);
            subscribeCell.appendChild(subscribeButton);
        });

        //appending the complete table after iterations into the container
        results.appendChild(table);
    } else {
        results.textContent = 'No data found. Try again.';
        results.style.color = '#ff0000';
    }
}

//-------------------------function for Subscribe button------------------------------
function subscribeMusic(item) {
    document.getElementById('subscribe-message').innerHTML = '';
    //fetching the current users email and the passed items' attributes
    const data = {
        email: sessionStorage.getItem('userEmail'),
        artist: item.artist,
        title: item.title,
        year: item.year
    };

    fetch('https://g9b3ksl41i.execute-api.us-east-1.amazonaws.com/production/subscribeSongs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //pass details of the item and the subscribeSongs lambada function create a seperate table inrelation to the users email
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            //alert(data.message);
            //Subcription Sucessful message
            document.getElementById('subscribe-message').innerHTML = data.message;
            //enusring the synchronous display of subscriptions once the button is triggered
            fetchSubscriptions(sessionStorage.getItem('userEmail'));

        })
        .catch(error => {
            console.error('Error subscribing:', error);
            document.getElementById('subscribe-message').innerHTML = 'Failed to load subscriptions';
        });
}

//------------------------Fetches data from the subscribedSongs dynamodb table------------------------
function fetchSubscriptions(email) {
    fetch(`https://1ovwzm4g90.execute-api.us-east-1.amazonaws.com/production/displaySubscriptions?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Process subscription data
            displaySubscriptions(data);
            document.getElementById('subscribe-message').innerHTML = '';
        })
        .catch(error => {
            console.error('Error fetching subscriptions:', error);
        });
}

//-----------------------Displaying Subscriptions in the table----------------------
function displaySubscriptions(subscriptions) {
    //selecting the container
    const list = document.querySelector('.subscription-list');
    list.innerHTML = '';

    const header = list.createTHead();
    const headerRow = header.insertRow();
    const headers = ['Artist', 'Title', 'Year', ' Artist Image', 'Action'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    const tbody = list.createTBody();

    subscriptions.forEach(sub => {
        const row = tbody.insertRow();
        row.insertCell().textContent = sub.artist;
        row.insertCell().textContent = sub.title;
        row.insertCell().textContent = sub.year;

        const imgCell = row.insertCell();
        const img = document.createElement('img');
        img.src = sub.imageUrl;
        img.style.width = '100px';
        img.style.alignContent = 'center';
        imgCell.appendChild(img);

        const actionCell = row.insertCell();
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'subscribe-button';
        removeButton.onclick = () => removeSubscription(sub);
        actionCell.appendChild(removeButton);
    });
}

//-----------------------Function for Remove button--------------------
function removeSubscription(sub) {
    document.getElementById('subscribe-message').innerHTML = '';
    // Confirm with the user before deleting the subscription
    /*        if (!confirm(`Are you sure you want to remove the subscription for "${sub.title}" by ${sub.artist}?`)) {
                return;
            }*/

    // Prepare the data for deletion
    //Reference - https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    const data = {
        email: sessionStorage.getItem('userEmail'),
        artist: sub.artist,
        title: sub.title
    };

    // API Gateway endpoint to delete the subscription
    fetch('https://xg6ugmx9l2.execute-api.us-east-1.amazonaws.com/production/removeSubscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('subscribe-message').innerHTML = data.message;
            //alert(data.message);
            // Refresh the subscription list
            fetchSubscriptions(sessionStorage.getItem('userEmail'));
        })
        .catch(error => {
            console.error('Error removing subscription:', error);
            //alert('Failed to remove subscription.');
            document.getElementById('subscribe-message').innerHTML = 'Failed to remove subscription';
        });
}