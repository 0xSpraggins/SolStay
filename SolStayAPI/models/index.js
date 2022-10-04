const Sequelize = require('sequelize');
const config = require('../config.json');

const sequelize = new Sequelize.Sequelize(
    config.ConnectionString.database,
    config.ConnectionString.user,
    config.ConnectionString.password, {
        host: config.ConnectionString.host,
        dialect: "mysql",
        port: config.ConnectionString.port,
        dialectOptions: {
            connectionTimeout: 100000
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User.js")(sequelize, Sequelize);
db.properties = require("./Property.js")(sequelize, Sequelize);
db.reservations = require("./Reservation.js")(sequelize, Sequelize);

module.exports = db;