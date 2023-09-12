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