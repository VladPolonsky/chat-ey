const db = require ('../models')
const ROLES = db.ROLES
const User = db.user

checkUserOrEmail = (req , res , next) =>{
 User.findOne({
    username: req.body.username
 }).exec((err , user)=>{
    if(err){
        res.status(500).send({msg:err})
        return
    }
    if(user){
        res.status(400).send({msg:"Username already taken!"})
        return
    }
    User.findOne({
        email:req.body.email
    }).exec((err, user)=>{
        if(err){
            res.status(500).send({msg : err})
            return
        }
        if(user){
            res.status(400).send({msg:"Email already taken!"})
            return
        }
        next()
    })
 })
}
checkExistedRoles = (req,res, next) =>{
    if (req.body.roles){
        for (let i = 0 ; i < req.body.roles.length ; i++){
            if (!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    msg:`Role ${req.body.roles[i]} not exists`
                })
                return
            }
        }
    }
    next()
}
const verifyRegister = {
    checkUserOrEmail,checkExistedRoles
}
module.exports = verifyRegister