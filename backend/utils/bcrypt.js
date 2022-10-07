const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Hasing password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

//Compare password mot if satsen i server.js. Exportera comparePassword nedan i module
async function comparePassword(password, storedPassword) {
    const isTheSame = await bcrypt.compare(password, storedPassword);
    return isTheSame;
}


//Exportera funktionen och importera båda i server.js
module.exports = { hashPassword, comparePassword }