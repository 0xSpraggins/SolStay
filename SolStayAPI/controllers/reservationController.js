const db = require("../models");
const {QueryTypes} = require("sequelize");

const Reservation = db.reservations;

exports.create = (req, res) => {
    // Validate Request
    if(!req.body) {
        res.status(400).send({
            message: "Request cannot be empty!"
        });
        return;
    }

    // Reservation Data Object
    const reservation = {
        renterId: req.body.renterId,
        propertyId: req.body.propertyId,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        transactionAddress: req.body.transactionAddress,
    }

    // Add reservation to the db
    Reservation.query(
        `INSERT INTO Reservations (RenterId, PropertyId, CheckIn, CheckOut, TransactionAddress)
        VALUES (:renterId, :propertyId, :checkIn, :checkOut, :transactionAddress)`,
        {
            replacements: {
                renterId: reservation.renterId,
                propertyId: reservation.propertyId,
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                transactionAddress: reservation.transactionAddress
            },
            type: QueryTypes.INSERT
        }
    )
};

exports.getActive = (req, res) => {
    // Validate Request
    if (!req.query.pubkey || !req.query.date) {
        res.status(400).send({
            message: "Public key and date cannot be empty!"
        });
        return;
    }
    // Reservation Data Object
    const reservation = {
        pubkey: req.query.pubkey,
        date: req.query.date
    }

    // Get active reservations
    Reservation.query(
        `SELECT Reservations.Id, Reservations.TransactionAddress, 
                Properties.AddressOne, Properties.AddressTwo, 
                Properties.City, Properties.Region,Properties.PostalCode
            FROM Reservations
            INNER JOIN Properties ON Reservations.PropertyId = Properties.Id
            WHERE RenterId = :pubkey
            AND Reservations.CheckIn <= :date
            AND Reservations.CheckOut >= :date
            LIMIT 1`,
        {
            replacements: {pubkey: reservation.pubkey, date: reservation.date},
            type: QueryTypes.SELECT
        }
    )
};

exports.getAllByUser = (req, res) => {
    // Validate Request
    if (!req.query.pubkey || !req.query.date) {
        res.status(400).send({
            message: "Public key and date cannot be empty!"
        });
        return;
    }
    // Reservation Data Object
    const reservation = {
        pubkey: req.query.pubkey,
        date: req.query.date
    }

    // Select all book reservations for a given user
    Reservation.query(
        `SELECT Reservations.Id, Properties.AddressOne, Reservations.CheckIn
            FROM Reservations
            INNER JOIN Properties ON Reservations.PropertyId = Properties.Id
            WHERE RenterId = :pubkey
            AND Reservations.CheckOut >= :date`,
        {
            replacements: {pubkey: reservation.pubkey, date: reservation.date},
            type: QueryTypes.SELECT
        }
    )
};
