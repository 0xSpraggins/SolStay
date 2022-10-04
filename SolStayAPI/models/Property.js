const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Property = sequelize.define('Property', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        ownerId: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        addressOne: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        addressTwo: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        postalCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        imageOne: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        imageTwo: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        imageThree: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        imageFour: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        imageFive: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        nightlyPrice: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        }
    }, {
        tableName: 'Properties'
    });

    return Property;
};
