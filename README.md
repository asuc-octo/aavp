### Configuration
- **Platform:** node
- **Framework**: express
- **Template Engine**: 
- **CSS Framework**: bootstrap with bootswatch paper ( https://bootswatch.com/paper/#navbar )
- **CSS Preprocessor**: none
- **JavaScript Framework**: angularjs
- **Build Tool**: gulp
- **Unit Testing**: none
- **Database**: mongodb
- **Authentication**: google, email
- **Deployment**: heroku
- **Packages**: angular-ui-bootstrap ( http://angular-ui.github.io/bootstrap/ )

### Setup Instructions:
1. Clone down repo from GitHub
2. Make a new branch:
* git checkout -b 'new-branch-name'
3. mongoDB: 
* Install mongoDB if not already installed
* Create data directory: $ sudo mkdir -p /data/db
* Set permissions: $ sudo chown -R 'your-computer-username' /data/db
4. Node 
* Install packages / dependencies $ npm install
* run server $ npm start
5. Making changes to code:
* ctrl+c to quit server
* to build changes $ npm run build
* start server again $ npm start

