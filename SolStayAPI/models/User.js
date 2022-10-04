const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        pubkey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isOwner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        tableName: 'Users'
    });
    return User;
};

