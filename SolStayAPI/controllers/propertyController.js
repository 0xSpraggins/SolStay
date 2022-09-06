const db = require("../models");
const {QueryTypes} = require("sequelize");

const Property = db.properties;

exports.create = (req, res) => {
    // Validate Request
    if(!req.body) {
        res.status(400).send({
            message: "Request cannot be empty!"
        });
        return;
    }
    // Properties Data Object
    const property = {
        pubkey: req.body.pubkey,
        address: req.body.addressOne,
        addressTwo: req.body.addressTwo,
        city: req.body.city,
        region: req.body.region,
        country: req.body.country,
        postalCode: req.body.postalCode,
        image: req.body.image,
        nightlyPrice: req.body.nightlyPrice
    }

    // Create new Property
    Property.query(
        `INSERT INTO Properties (OwnerId, AddressOne, AddressTwo, City, Region, Country, PostalCode, ImageOne, NightlyPrice)
        VALUES (:ownerId, :addressOne, :addressTwo, :city, :region, :country, :postalCode, :imageOne, :nightlyPrice)`,
        {
            replacements : {
                ownerId: property.pubkey,
                addressOne: property.address,
                addressTwo: property.addressTwo,
                city: property.city,
                region: property.region,
                country: property.country,
                postalCode: property.postalCode,
                imageOne: property.image,
                nightlyPrice: property.nightlyPrice
            },
            type: QueryTypes.INSERT
        }
    )
};

exports.getAll = (req, res) => {
    // Get all Properties
    Property.query(
        `SELECT * FROM Properties`,
        {
            type: QueryTypes.SELECT
        }
    )
};

exports.getOne = (req, res) => {
    // Validate Request
    if (!req.query.id) {
        res.status(400).send({
            message: "Property Id cannot be empty!"
        });
        return;
    }
    // Properties Data Object
    const property = {
        id: req.query.id
    }

    // Get property by Id
    Property.query(
        `SELECT * FROM Properties WHERE Id = :id`,
        {
            replacements: {id: property.id},
            type: QueryTypes.SELECT
        }
    )
};

exports.getAllByUser = (req, res) => {
    // Validate Request
    if (!req.query.pubkey) {
        res.status(400).send({
            message: "Public key cannot be empty!"
        });
        return;
    }

    // Properties Data Object
    const property = {
        ownerId: req.query.pubkey
    }

    // Get all properties owned by a user
    Property.query(
        `SELECT * FROM Properties WHERE OwnerId = :ownerId`,
        {
            replacements: {ownerId: property.ownerId}
        }
    )
};