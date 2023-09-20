# Virtual Canvas 
***
#### Custom Mozzila Hubs Client Repository
https://github.com/LukeMacdonald/hubs
#### Link to Custom Mozilla Hubs Client
https://canvas-hub.com/
#### Link to our Deployed Custom Canvas Client
https://client.canvas-hub.com/

## Instructions to Work with Deployed Hubs
<hr/>
#### 1. Create data and user jsons
In the server directory create the below jsons:
- These jsons should just be temporary until database is created.

<b>users.json</b>
```json
{ 
  "accounts":{}
}
```
<b>data.json</b>
```json
{
  "70814": {
    "modules": {},
    "courseID": "70814"
  }
}
```
#### 2. Updating environment variables
In side the server directory add the below environment variables:
```shell
HUBS_API_KEY=YOUR_TOKEN
PORT=3000
```
##### NOTE: Where to get token
1. Navigate to the signin page on https://canvas-hub.com/
2. Enter the email canvasmozillahub@gmail.com
3. A verification will be sent to this email you can either contact Luke to get the password to the email or 
   to have him verify for you.
4. Once you are signined into the account travel to https://canvas-hub.com/tokens
5. Create a new token for account that has read and write permissions.
6. Copy the token into the environment variable. 
### 2. Run both the client and server on your local host.
Run the below in both the client and server directories.
```shell
npm ci
npm start
```
### 3. Create account on frontend
1. Navigate to https://client.canvas-hub.com 
2. Select Sign up link below login button.
3. Fill in id and password fields
4. Fill in token field with you canvas developer key (make sure it has sufficient permissions attached to it.)

## Instructions to Work with Self-Hosted Hubs
<hr/>
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