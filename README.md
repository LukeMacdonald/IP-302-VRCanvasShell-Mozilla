## How to Run Application
### Running Application on Main Branch
For the main branch the backend (proxy server) that does all the requests to canvas and mozilla hubs is run on our allocated RMIT server.

- Code should not be changed directly in the main branch instead create other branches to implement new features and then merge that branch into main when it is complete.
- There is a pipeline set up with GitHub actions that will automatically deploy and pushes made onto the main branch onto the RMIT server.

#### Gaining Access to Proxy Server
In order for you to be able to run the application on the main branch you'll have to add rules in our allocated server to give yourselves permissions to acccess ports.

After you ssh into the script run the below command for each PORT you need access to
```shell
sudo ufw allow from [IP_ADDRESS] to any port [PORT_NUMBER]
```

The port numbers are: 
- 80
- 443
- 9222
- 3000
### Running Application in Development
In order to run the application on a separate branch that youll use to make modifications to the code you'll just have to make sure that you are running the proxy server locally on your device and that you change all the endpoints url to localhost instead of the IP of server.
##### Location of Code to Change
In this file [(click here)](client/src/data/api.js) make the below change:
```javascript
    const DOMAIN = "http://131.170.250.239:3000" 
```
Change to:
```javascript
    const DOMAIN = "http://localhost:3000"
```
### Changing the Mozilla Hubs Client
Currently the application is using a custom client that has been deployed, if you would like to change what client the rooms are being created on make the below changes
#### Set your environment variable
Inside the server directory you should have created a .env file that contains all the environment variables needed for the application to run. 

To set your own hubs client set the below environment variable to the link of that client
``` shell
    HUBS_PUBLIC_URL="YOUR LINK GOES HERE"
```
#### Gettings Hubs Token
If using your own client you'll need an api token to be able to allow the application to create new rooms.
Go to this page to create a token: https://your-link-here/tokens

After creating your token set the below environment variable to its value:
```shell
    HUBS_API_KEY="YOUR TOKEN"
```
##### Video Guide to Mozilla Hubs API
https://www.youtube.com/watch?v=1J84biwO_bk

#### Chaning SceneID in CreateRoom
The final step for setting the application to work on your client is to set the sceneID inside the createRoom api call on the proxy server.
- SceneIDs can be found on the admin portal on your mozilla hubs (given that you have already created or imported some scenes.)



## Updated Instructions to Work with Self-Hosted Hubs
#### 1. Update Firewall to allow you to connect on all required ports
```shell
sudo ufw allow from [IP_ADDRESS] to any port 80,443,3000,4000,4443,9222,8080,8989,9090/tcp
```
#### 2. Update Hosts Files
Open on for the below files depending on your OS
- <b>Linux and MacOS</b>: ```\etc\hosts```
- <b>Windows:</b>: ```C:\Windows\System32\drivers\etc\hosts```

After opening the file add the below statements
```
131.170.250.239       hubs.local
131.170.250.239       hubs-proxy.local
```

#### 3. Allow Self-Signed Certificates
Service communication is encrypted with self-signed Transport Layer Security (TLS) certificates. You will need to accept the proxy certificate and the certificate at each of the Hubs ports
To do this visit all the below links and follow their prompts to give access:
- [Proxy](https://hubs-proxy.local:4000/)
- [Dialog](https://hubs.local:4443/)
- [Spoke](https://hubs.local:9090/)
- [Hubs Admin](https://hubs.local:8989/)
- [Hubs Client](https://hubs.local:8080/)
- [Reticulum](https://hubs.local:4000/)

#### 4. Logging in Hubs Client as Admin
An admin account has already been created so use the following email to log into account:
```canvasmozillahubs@gamil.com```

#### 5. Getting Access Token
Due to being run locally the verification of the email will need to be done by accessing the generated token on the RMIT server.
1. SSH into server
2. Get list of all docker containers running
```docker ps```
3. Retrieve the ID of container named ```hubs-compose-reticulum```
4. Get Logs of that container (The request for verification needs to have been already done).
 ```docker logs CONTAINER_ID```
5. If request for verification just occurred the verification link should be right near the bottom of the logs. The link youll need will look like this https://hubs.local:4000/?auth_origin=hubs&auth_payload=XXXXX&auth_token=XXXX
6. Paste the retrieved link onto your browser.

#### Tips to prevent potential bugs you could encounter
1. Always make sure you use `https://hubs.local` when as using the IP address of the server uses causes an error with the connection between the client and reticulm which prevents data retieval from database.
2. Try to run the application on Chrome as I've tried with Safari and it doesn't seem to load properly.