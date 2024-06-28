# 🎵 Music Subscription Service - AWS Cloud Computing Application

## Project Description

The **Music Subscription Service** is a comprehensive cloud-based web application developed entirely by me using various AWS services. This application allows users to register, log in, and manage their music subscriptions. The backend is powered by AWS services such as EC2, S3, API Gateway, Lambda, and DynamoDB, while the frontend is built using HTML, CSS, and JavaScript.

## ☁️ Cloud Computing Concepts

### AWS Services Utilized

- **Amazon EC2**: Hosts the frontend and backend application on a virtual server, providing scalable computing capacity.
- **Amazon S3**: Stores artist images and other static resources, offering highly scalable and durable storage.
- **Amazon DynamoDB**: Manages user data and subscription details with a fast and flexible NoSQL database service.
- **AWS Lambda**: Executes backend logic in response to API Gateway requests without provisioning or managing servers.
- **Amazon API Gateway**: Manages API requests and routes them to the appropriate Lambda functions, enabling a serverless architecture.

## 🌟 Key Features

### 🔐 User Authentication and Profile Management
- **Sign In and Sign Up**: Secure user registration and login with validation, managed through Lambda functions and DynamoDB.
- **Profile Management**: Users can view and manage their profile information, with data stored in DynamoDB.

### 🎧 Music Subscription Management
- **Subscription Management**: Users can subscribe to and remove subscriptions for their favorite songs, with operations handled by Lambda functions and data stored in DynamoDB.
- **Music Query**: Users can search for songs based on various criteria, utilizing API Gateway and Lambda for querying the DynamoDB.

### 🛡️ Additional Features
- **Secure Data Storage**: User data and subscriptions are securely stored in DynamoDB.
- **Image Management**: Artist images are stored and managed in AWS S3.
- **Responsive Design**: The website is fully responsive and styled for a professional look.

## 🎨 Project Structure

- **Frontend Files**: 
  - `index.php`
  - `login.html`
  - `register.html`
  - `mainpage.html`
  - `login.css`
  - `register.css`
  - `mainpage.css`
  - `mainpage.js`
  
- **Backend Files**:
  - `MusicCreateTable.java`
  - `MusicLoadData.java`
  - `ArtistImageUpload.java`
  - `CreateImageBucket.java`
  - `displaySubscriptions.js`
  - `QueryButton.js`
  - `removeSubscription.js`
  - `subscribeSongs.js`
  - `UserLogin.js`
  - `UserRegistration.js`

## 🏢 University and Course

- **RMIT University**
- **Course**: Cloud Computing (COSC2626/2640)
- **Semester**: Semester 1, 2024

## 📝 Deployment

The application is fully hosted on an AWS EC2 instance and utilizes various AWS services to manage the backend infrastructure and storage. Here is an overview of the deployment architecture:

1. **EC2 Instance**: Hosts the frontend and backend application, providing scalable virtual computing.
2. **API Gateway**: Manages API requests and routes them to the appropriate Lambda functions, enabling a serverless API architecture.
3. **Lambda Functions**: Handle backend logic for operations such as user registration, login, subscription management, and querying music data.
4. **DynamoDB**: Stores user data, subscription details, and music information, offering fast and flexible NoSQL database service.
5. **S3**: Stores and serves artist images and other static resources, providing highly scalable and durable storage.

## 🔗 Repository

The complete source code for this project is available in the following GitHub repository:

- [Music Subscription Service Repository](https://github.com/your-username/music-subscription-service)

## 📬 Contact

For any queries or further information, please contact:

- **Name**: [Don Abeynayake]
- **Email**: [abthaveesh@gmail.com]

Feel free to explore the repository and the documentation to learn more about the project and my contributions.

---
