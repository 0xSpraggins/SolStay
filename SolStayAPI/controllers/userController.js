const db = require("../models");
const {QueryTypes} = require("sequelize");

const User = db.users;

const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    // Request validation
    if (!req.body.pubkey) {
        res.status(400).send({
            message: "Public Key cannot be empty!"
        });
        return;
    }

    // Create a User
    const user = {
        pubkey: req.body.pubkey,
        isOwner: req.body.isOwner,
    }

    // Add user to db
    User.query(
        'INSERT INTO Users (Pubkey, IsOwner) VALUES (:pubkey, :isOwner)',
        {
            replacements: { pubkey: user.pubkey, isOwner: user.isOwner },
            type: QueryTypes.INSERT
        }
    );

};

exports.getUser = (req, res) => {
    // Request validation
    if (!req.query.pubkey) {
        res.status(400).send({
            message: "Public Key cannot be empty!"
        });
        return;
    }

    // User Data Object
    const user = {
        pubkey: req.query.pubkey
    }

    // Get user from db
    User.query(
        'SELECT * FROM Users WHERE Pubkey = :pubkey',
        {
            replacements: { pubkey: user.pubkey },
            type: QueryTypes.SELECT
        }
    );
};

exports.update = (req, res) => {
    // Request validation
    if (!req.body.pubkey || !req.body.isOwner) {
        res.status(400).send({
            message: "User info cannot be empty!"
        });
        return;
    }

    // User Data Object
    const user = {
        pubkey: req.body.pubkey,
        isOwner: req.body.isOwner,
    }

    // update user in db
    User.query(
        'UPDATE Users SET IsOwner = :isOwner WHERE Pubkey = :pubkey',
        {
            replacements: { isOwner: user.isOwner, pubkey: user.pubkey },
            type: QueryTypes.UPDATE
        }
    );
};

