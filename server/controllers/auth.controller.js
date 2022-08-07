const config = require("../config/auth.config")
const db = require("../models")
const User = db.user
const Role = db.role
let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs")
const { user } = require("../models")
exports.register = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ msg: err })
            return
        }
        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ msg: err })
                        return
                    }
                    user.roles = roles.map(role => role._id)
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ msg: err })
                            return
                        }
                        res.send({ msg: "User registered !" })
                    })
                }
            )
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ msg: err })
                    return
                }
                user.roles = [role.id]
                user.save(err => {
                    if (err) {
                        res.status(500).send({ msg: err })
                        return
                    }
                    res.send({ msg: "User registered" })
                })
            })
        }
    })
}
exports.login = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ msg: err })
                return
            }
            if (!user) {
                return res.status(404).send({ msg: "User not found." })
            }
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    msg: "Wrong password!"
                })
            }
            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 90000
            })
            let authorities = []
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase())
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            })
        })
}