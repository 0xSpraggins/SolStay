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

// app.post('/user', (req, res) => {
//     const Pubkey = req.body.pubkey;
//     const IsOwner = req.body.isOwner;
//
//     connection.query(
//         'INSERT INTO Users (Pubkey, IsOwner) VALUES (?,?)',
//         [Pubkey,IsOwner],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.send("Values Inserted");
//             }
//         }
//     )}
// );

app.get('/getUser', (req, res) => {
    const Pubkey = req.query.pubkey;
    console.log(Pubkey);
    connection.query(
        'SELECT * FROM Users WHERE Pubkey = ?', 
        [Pubkey],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )}
);

app.put('/updateUser', (req, res) => {
    const Pubkey = req.body.pubkey;
    const IsOwner = req.body.isOwner;
    console.log(IsOwner);
    connection.query(
        'UPDATE Users SET IsOwner = ? WHERE Pubkey = ?',
        [IsOwner, Pubkey],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

app.get('/getUserProperties', (req, res) => {
    const Pubkey = req.query.pubkey;

    connection.query(
        'SELECT * FROM Properties WHERE OwnerId = ?',
        [Pubkey],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

app.post('/newProperty', (req, res) => {
    const Pubkey = req.body.pubkey;
    const AddressOne = req.body.addressOne;
    const AddressTwo = req.body.addressTwo;
    const City = req.body.city;
    const Region = req.body.region;
    const Country = req.body.country;
    const PostalCode = req.body.postalCode;
    const Image = req.body.image;
    const NightlyPrice = req.body.nightlyPrice

    connection.query(
        `INSERT INTO Properties (OwnerId, AddressOne, AddressTwo, City, Region, Country, PostalCode, ImageOne, NightlyPrice)
        VALUES (?,?,?,?,?,?,?,?,?)`,
        [Pubkey, AddressOne, AddressTwo, City, Region, Country, PostalCode, Image, NightlyPrice],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

app.get('/getAllProperties', (req, res) => {
    connection.query(
        'SELECT * FROM Properties',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

app.get('/getUsersReservations', (req, res) => {
    const Pubkey = req.query.pubkey;
    const Date = req.query.date;
    console.log(Pubkey);
    connection.query(
        `SELECT Reservations.Id, Properties.AddressOne, Reservations.CheckIn
            FROM Reservations
            INNER JOIN Properties ON Reservations.PropertyId = Properties.Id
            WHERE RenterId = ?
            AND Reservations.CheckOut >= ?`,
        [Pubkey, Date],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

// If 0 return something
app.get('/getActiveReservation', (req, res) => {
    const Pubkey = req.query.pubkey;
    const Date = req.query.date;
    console.log(Pubkey);
    connection.query(
        `SELECT Reservations.Id, Reservations.TransactionAddress, 
                Properties.AddressOne, Properties.AddressTwo, 
                Properties.City, Properties.Region,Properties.PostalCode
            FROM Reservations
            INNER JOIN Properties ON Reservations.PropertyId = Properties.Id
            WHERE RenterId = ?
            AND Reservations.CheckIn <= ?
            AND Reservations.CheckOut >= ?
            LIMIT 1`,
        [Pubkey, Date, Date],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    ) 
})

app.get('/getPropertyDetails', (req, res) => {
    const Id = req.query.id;
    connection.query(
        'SELECT * FROM Properties WHERE Id = ?',
        [Id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
});

app.post('/saveReservation', (req, res) => {
    const RenterId = req.body.renterId;
    const PropertyId = req.body.propertyId;
    const CheckIn = req.body.checkIn
    const CheckOut = req.body.checkOut;
    const TransactionAddress = req.body.transactionAddress;

    connection.query(
        `INSERT INTO Reservations (RenterId, PropertyId, CheckIn, CheckOut, TransactionAddress)
        VALUES (?,?,?,?,?)`,
        [RenterId, PropertyId, CheckIn, CheckOut, TransactionAddress],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(result);
            }
        }
    )
})

app.listen(3003, () => {
    console.log("Server is listening on 3003...");
})

