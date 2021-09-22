const express = require('express')
const app = express()
const port = 3000
const path =require("path")
const mongoose = require('mongoose');
var session = require('express-session')
var flash = require('connect-flash');

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/sarahaApp',
    collection: 'mySessions'
    });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(flash());

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
            cb(null,uniqueSuffix+ '-' + file.originalname)
    }
})


function fileFilter (req, file, cb) {

    if (file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg') {
        cb(null, true)
    }else{
        cb(null, false)

    }
    // To accept the file pass `true`, like so:
}

const upload = multer({ dest: 'uploads',storage ,fileFilter })
app.use(upload.single('photo'))





app.use("/uploads",express.static(path.join(__dirname,"uploads")))




app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:false}))

app.use(require('./router/home.routes'))
app.use(require('./router/login.routes'))
app.use(require('./router/register.routes'))
app.use(require('./router/message.routes'))
app.use(require('./router/user.routes'))
app.use(require('./router/logout.routes'))
app.use(require('./router/forgetPassword.routes'))


app.get('*', (req, res) => {
    res.send("404 not founded page");
});

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/sarahaApp');
}

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))