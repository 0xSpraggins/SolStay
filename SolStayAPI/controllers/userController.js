const db = require("../models");
const {QueryTypes} = require("sequelize");

const User = db.users;

const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    // Request validation
    if (!req.body.pubkey) {
        res.status(400).send({
            message: "Content cannot be empty!"
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

}