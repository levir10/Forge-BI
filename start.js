const path = require('path');//bringing in built in node js modeules ( to resulve file system path )
const express = require('express');//module to create the express server 

const cookieSession = require('cookie-session');//module that we installed as a dependency - to handle storring and rereieving custome info for out app 
//express uses the concept of middlewere --> small pieces of code that you can "stack" on top of each other, and any incoming web request will flow thrue this pieces of code.
//any piece of code would have an opportunity to handle the request 
const PORT = process.env.PORT || 3000;
const config = require('./config.js');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {//check if the confi file includes this properties
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
//static middlewere to check for the front end files (html,js,css)
app.use(express.static(path.join(__dirname, 'public')));//method inside express module: a middlewere for serving static files  this line will check in 'public' folder if the request 
//that is sent (specific file) is in there. if so - it will ignore the rest of the stack(the rest of the code)
app.use(cookieSession({
    // create 2 cookies that stores the name and encripted key 
    name: 'forge_session',
    keys: ['forge_secure_key'],//takes cater of decipher the encription for the forge key for us 
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
}));
app.use(express.json({ limit: '50mb' }));//middlewere that looks at the title of the request - and if its .json it will look at the body of the request and parese it to javascript object
app.use('/api/forge', require('./routes/oauth.js'));//adding our custom express routers that will handle the different endpoints.
app.use('/api/forge', require('./routes/datamanagement.js'));
app.use('/api/forge', require('./routes/user.js'));
app.use((err, req, res, next) => {
    console.error(err);// catch all the errors , and send the text of error as json
    res.status(err.statusCode).json(err);
});
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });//  run our app through a specific port ( by default 3000)
