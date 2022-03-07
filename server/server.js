const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();
 require('dotenv').config();
var fileupload = require("express-fileupload");
app.use(fileupload());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());


const REST_API_ROOT = '/api';
app.use(REST_API_ROOT, require('./routes/router'));

app.use(express.static(path.join(__dirname, '/Docs')));



const port = 7000;
app.listen(port);

console.log('App is listening on port ' + port);

