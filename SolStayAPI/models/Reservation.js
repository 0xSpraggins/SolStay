const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        renterId: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        propertyId: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        checkIn: {
            type: DataTypes.DATE(25),
            allowNull: false
        },
        checkOut: {
            type: DataTypes.DATE(25),
            allowNull: false,
        },
        transactionAddress: {
            type: DataTypes.STRING(150),
            allowNull: false,
        }
    }, {
        tableName: 'Reservations'
    });

    return Reservation;
};