require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const db = require('./db')
const bcrypt = require('bcrypt')

app.use(cors());

app.use(express.json());

//POST create contact
app.post("/application/contacts", async(req, res) => {

    try {
        const results = await db.query(
            "INSERT INTO people (name,last_name,phone_number)values ($1,$2,$3) returning * ", [req.body.name, req.body.last_name, req.body.phone_number]);
        res.status(200).json({
            status: "success",
            data: {
                people: results.rows[0],
            },

        })

    } catch (err) {
        console.log(err)
    }

});

//GET contacts


app.get("/application/contacts", async(req, res) => {

    try {
        const results = await db.query("SELECT * FROM people ORDER BY name ASC ");

        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                people: results.rows,
            },

        })
    } catch (err) {
        console.log(err)
    }
});

//DELETE contact

app.delete("/application/contacts/:id", async(req, res) => {

    try {
        const results = db.query('DELETE FROM  people where  id=$1 ', [req.params.id])
        res.status(204).json({
            status: "No Content",
            data: {
                people: "macdonalds",
            },

        })
    } catch (err) {
        console.log(err)
    }

});

//GET a contact

app.get("/application/contacts/:id", async(req, res) => {

    try {
        const results = await db.query("select * from people where id = $1", [req.params.id]);
        res.status(201).json({
            status: "success",
            data: {
                people: results.rows[0],
            },

        })

    } catch (err) {
        console.log(err)
    }

});



//UPDATE update  contact info

app.put("/application/contacts/:id", async(req, res) => {

    try {
        const results = await db.query('UPDATE people  SET  name=$1, last_name=$2,  phone_number=$3 where id=$4 returning * ', [req.body.name, req.body.last_name, req.body.phone_number, req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                people: results.rows[0],
            },

        })
    } catch (err) {
        console.log(err)
    }
});


//POST create user 
app.post("/register", async(req, res) => {

    try {
        /*const results = await db.query(
        "INSERT INTO users (username, email,password)values ($1,$2,$3) returning * ", [req.body.username, req.body.email, req.body.password]);*/
        const user = await db.query(
            "SELECT FROM users  WHERE ( email )values ($1) returning * ", [req.body.email]);
        res.status(200).json({
            status: "success",
            data: {
                users: user.rows[0],
            },
        })

        if (user.rows.length !== 0) {
            return res.status(401)
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)

        const bcryptPassword = bcrypt.hash(passwor, salt)

        const results = await db.query(
            "INSERT INTO users (username, email,password)values ($1,$2,$3) returning * ", [req.body.username, req.body.email, req.body.bcryptPassword]);

    } catch (err) {
        console.log(err)
    }

});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`${port}`)
})