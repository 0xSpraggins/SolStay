const express = require('express');
const mysql = require('mysql');
const config = require('./config.json');
const cors = require('cors');

// import routes
const users = require('./routes/users');
const properties = require('./routes/properties');
const reservations = require('./routes/reservations');

//Initialize server app
const app = express();

//Add cors and json formatting to the API
app.use(cors());
app.use(express.json());

//Add routes to the express server
app.use("/users", users);
app.use('/properties', properties);
app.use('/reservations', reservations);

const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log('Synced database');
    })
    .catch((err) => {
        console.log("Failed to sync db" + err.message);
    });

app.listen(3003, () => {
    console.log("Server is listening on 3003...");
})

