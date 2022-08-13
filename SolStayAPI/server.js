const express = require('express');
const app = express();
const mysql = require('mysql');
//Use morgan for better server logging
const morgan = require('morgan');
const config = require('./config.json');

app.use(morgan('short'));

app.get('/users/:id', (req, res) => {
    console.log("Fetching all users");
    console.log("Fetching user with id: "+ req.params.id);
    //Create a connection to mysql database
    const connection = mysql.createConnection({
        host: config.ConnectionString.host,
        user: config.ConnectionString.user,
        password: config.ConnectionString.password,
        database: config.ConnectionString.database,
        port: config.ConnectionString.port,
    })

    //Get all the users from the mysql database
    connection.query("SELECT * FROM Users", (err, rows, fields) => {
        console.log("Data Fetched");
        res.json(rows)
        console.log(err);
    })

    //res.end();
})


app.listen(3003, () => {
    console.log("Server is listening on 3301...");
})

