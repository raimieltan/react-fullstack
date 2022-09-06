import express, { application } from "express"
import bodyParser from "body-parser"
import { connectDatabase } from "./pool.js"
import { v4 as uuidv4 } from "uuid"
import { generateJWT } from "./jwt/jwtGenerator.js"
import bcrypt from "bcryptjs"
import { auth } from "./middleware/auth.js"
import cors from "cors"

const app = express()
const pool = connectDatabase()
const PORT = 8000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.post('/register', async (req, res) => {

    const { username, password } = req.body

    const user = await pool.query(`
    SELECT * FROM users 
    WHERE username = $1
    `, [username])

    if (user.rows.length > 0) {
        res.status(401).send("Username has been taken")
    }

    //Setup bcrypt 
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(`
    INSERT INTO users (uuid, username, password)
    VALUES ($1, $2, $3) RETURNING *
    `, [uuidv4(), username, bcryptPassword])

    const token = generateJWT(newUser.rows[0])

    res.json({ token })

})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await pool.query(`
        SELECT * FROM users 
        WHERE username = $1
        `, [username])

        if (user.rows[0].length < 0) {
            res.status(401).send("Username or password is incorrect")
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password)

        if (!validPassword) {
            return res.status(401).json("Password or username is incorrect")
        }

        const token = generateJWT(user.rows[0])
        res.json({ token })

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ msg: error.message});
    }
})

app.get('/profile', auth, async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ msg: "Unauthenticated" });
    
    }
})

app.get('/tweets', auth, async (req, res) => {
    try {
        const tweets = await pool.query(`
        SELECT * FROM tweets
        `)

        
        res.json(tweets.rows)
        
    } catch (error) {
        console.error(error.message);
    }
})

app.post('/tweets', auth, async (req, res) => {
    try {
        const { content } = req.body

        const newTweet = await pool.query(`
        INSERT INTO tweets (content) VALUES
        ($1) RETURNING *
        `, [content])

        res.json("Tweet sent");
    } catch (error) {
        
    }
})
pool.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    else {
        app.listen(PORT, () => {
            console.log(`Server has started on http://localhost:${PORT}`)
        })
    }
})