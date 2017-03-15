/*eslint no-console:0 */
'use strict';
const express = require('express');
const open = require('open');
const fs=require("fs");
const app = express();
const port = 3000;

app.use(express.static("./"));
app.listen(port, function() {
    console.log("server start");
    open('http://localhost:' + port + '/index.html');
});
