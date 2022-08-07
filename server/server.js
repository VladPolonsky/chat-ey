const express = require("express")
const cors = require("cors")
const app = express()

let corsOption = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const db = require("./models")
const Role = db.role
db.mongoose.connect(`mongodb://localhost:27017/ey_db`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to DataBase")
        initial()
    })
    .catch(err => {
        console.log("Connection error", err)
        process.exit()
    })

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'user' to roles collection")
            })
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'admin' to roles collection")
            })
        }
    })
}

app.get("/", (req, res) => {
    res.json({ msg: "Welcome to the app" })
})
const PORT = process.env.PORT || 8080

// app.use('/', require('./routes/auth.routes'))

app.listen(PORT, () => {
    console.log(`server up and running on ${PORT}`)
})