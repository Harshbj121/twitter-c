const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "user not logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jsonwebtoken.verify(token, JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).json({ error: error.message });
        }
        const _id= payload.id;
        UserModel.findById(_id)
            .then((dbUser) => {
                req.user = dbUser;
                next();
            })
    })
}