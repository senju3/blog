const Sequelize = require('sequelize');
const connection = require('../databases/connection');
const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = User;