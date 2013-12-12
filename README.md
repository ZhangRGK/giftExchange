giftExchange
============
#deploy

##install node and npm
http://nodejs.org/download/git

##install packages

`npm install`

##init database
1. edit *sh/init.js* shell script: `mongo IPAddress:Port DBName init.js`
2. run `sh init.sh` in Terminal

##start server
`node app.js`