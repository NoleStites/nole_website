Prerequisites:     
1. Install nvm and node          
$ sudo apt update            
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash       
$ nvm install v22.11.0  

2. Install package for using environment variables for database connection
$ npm install --save-dev dotenv

3. Install MongoDB Community Edition local server
    (https://www.mongodb.com/try/download/community-kubernetes-operator)
4. Open a terminal
    - Start the MongoDB local server: $ sudo systemctl start mongod
    - Check that it is running: $ sudo systemctl status mongod

To run:
1. nvm use v22.11.0
2. node server.js