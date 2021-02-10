const tasksResolver = require('./tasks');
const usersResolver = require('./users');

module.exports = {
    ...usersResolver,
    ...tasksResolver,
}