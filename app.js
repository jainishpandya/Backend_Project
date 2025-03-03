const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
require('./Models/db')

const UserRouter = require('./Routers/UserRouter');
const ClubRouter = require('./Routers/ClubRouter');
const BookRouter = require('./Routers/BookRouter');

app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
    res.send("chal raha hai");    
});

app.use('/user', UserRouter)
app.use('/book', BookRouter)
app.use('/club', ClubRouter)

module.exports = app