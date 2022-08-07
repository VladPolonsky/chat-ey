const {verifyRegister} = require ("../middlewares")
const controller = require ("../controllers/auth.controller")

module.exports = function(app){
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Header",
            "auth-token,Origin,Conect-Type,Accept"
        )
        next()
    })
    
    app.post(
        "/api/auth/register",
        [
            verifyRegister.checkUserOrEmail,
            verifyRegister.checkExistedRoles
        ],
        controller.register
    )
    app.post("/api/auth/login", controller.login)
}