# React Linkedin Login

A simple app to demo Linkedin login

## Demo

https://ancient-cove-62038.herokuapp.com/

## Usage

### Clone

```shell
git clone -b linkedin https://github.com/hjoshi123/LoginNodeJS.git
```

### Install Dependencies

Intall dependencies for server
```shell
cd React-Linkedin-Login
npm install
```

Install dependencies for client
```shell
cd client
npm install
```
### Get Linkedin App Credential from Linkedin Developer Portal

- client_id
- client_secret

Configure 'http://localhost:8080/callback' as Oauth2.0 redirect uri

### Create Environment Variables

/React-Linkedin-Login/.env

```shell
EXPRESS_APP_CLIENT_ID=${Your-Client-ID}
EXPRESS_APP_CLIENT_SECRET=${Your-Client-Secret}
EXPRESS_APP_REDIRECT_URI=http://localhost:8080/callback
```

/React-Linkedin-Login/client/.env

```shell
REACT_APP_CLIENT_ID=${Your-Client-ID}
REACT_APP_REDIRECT_URI=http://localhost:8080/callback
```

### Build Client

/React-Linkedin-Login/client:

```shell
yarn run build
```

### Start Server

/React-Linkedin-Login/:

```shell
PORT=8080 npm start
```