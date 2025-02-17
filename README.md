Prerequisites:     
1. Install nvm and node          
$ sudo apt update            
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash       
$ nvm install v22.11.0  

2. Install package for using environment variables for database connection
$ npm install --save-dev dotenv

To run:
1. nvm use v22.11.0
2. node server.js