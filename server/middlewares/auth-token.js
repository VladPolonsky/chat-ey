const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")
const db = require("../models")
const mongoose = require("mongoose")
const User = db.user
const Role = db.role
verifyToken = (req, res, next) => {
    let token = req.headers["auth-token"]
    if (!token) {
        return res.status(403).send({ msg: "Token not found" })
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ msg: "Unauthorized!" })
        }
        req.userId = decoded._id
        next()
    })
}
isAdmin = (req, res, next) => {
    User.findById(mongoose.Types.ObjectId(req.userId)).exec((err, user) => {
        console.log(req.userId)
        if (err) {
            res.status(500).send({ msg: err })
            return
        }
        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ msg: err })
                    return
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next()
                        return
                    }
                }
                res.status(403).send({ msg: "Require admin role" })
                return
            }
        )
    })
}
const authJwt =
{
    verifyToken, isAdmin
}
module.exports = authJwt
