const express = require('express');
const app = express();
const mysql = require('mysql');
const config = require('./config.json');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: config.ConnectionString.host,
    user: config.ConnectionString.user,
    password: config.ConnectionString.password,
    database: config.ConnectionString.database,
    port: config.ConnectionString.port,
})

app.post('/user', (req, res) => {
    const Pubkey = req.body.pubkey;
    const IsOwner = req.body.isOwner;

    connection.query(
        'INSERT INTO Users (Pubkey, IsOwner) VALUES (?,?)', 
        [Pubkey,IsOwner],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }
        }
    )}
);

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
        VALUES (?,?,?,?,?,?,?,?)`,
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
    console.log(Pubkey);
    connection.query(
        'SELECT * FROM Reservations WHERE RenterId = ?',
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
        VALUES (?,?,?,?,?,?)`,
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

