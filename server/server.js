require('dotenv').config()
const express = require('express')
const session = require('express-session')
const axios = require('axios')
const massive = require('massive')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

const {
    SERVER_PORT,
    REACT_APP_DOMAIN,
    REACT_APP_CLIENT_ID,
    CLIENT_SECRET,
    CONNECTION_STRING,
    SESSION_SECRET,
    DEV_KEY,
    AUTH_ID
} = process.env

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
})

app.get('/auth/callback', async (req, res) => {
    let payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
    }
    let resWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload)
    let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo/?access_token=${resWithToken.data.access_token}`)

    const db = req.app.get('db')
    let { sub } = resWithUserData.data

    let foundUser = await db.login.find_user([sub])

    if (foundUser[0]) {
        req.session.userid = foundUser[0].userid
        res.redirect('/#/home')
    } else {
        let createdUser = await db.login.create_user(sub)
        req.session.userid = createdUser[0].userid
        res.redirect('/#/home')
    }
})

app.get('/api/userData', async (req, res) => {
    const db = req.app.get('db')

    if (DEV_KEY === 'true') {
        let user = await db.login.find_user(AUTH_ID)
        req.session.userid = user[0].userid
        let { userid } = req.session
        res.status(200).send({ userid })
    } else {
        if (userid) {
            res.status(200).send({ userid })
        } else {
            res.status(401).send('Please Login')
        }
    }
})

app.get('/api/getStories', async (req, res) => {
    const db = req.app.get('db')
    let {userid} = req.session

    let count = await db.stories.get_stories_count(userid)
    let stories = await db.stories.get_stories(userid)

    res.send({count, stories})
})

app.delete('/api/deleteStory/:storyid', async(req, res) => {
    const db = req.app.get('db')
    let {userid} = req.session
    let {storyid} = req.params

    let deletedChara = await db.characters.delete_all(userid, storyid)
    //will eventually need to add a plot AND plot tree delete all
    let deletedStory = await db.stories.delete_story(userid, storyid)

    res.sendStatus(200)
})

app.post('/api/addStory', async (req, res) => {
    const db = req.app.get('db')
    let {userid} = req.session
    let {title} = req.body

    let addedStory = db.stories.add_story(userid, title)

    res.sendStatus(200)
})

app.post('/api/addChara/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let {storyid} = req.params
    let {
        first_name,
        last_name,
        gender,
        hair_color,
        eye_color,
        hobby,
        age,
        occupation,
        dd_alignment,
        special_abilities 
    } = req.body

    let newChara = await db.characters.add_chara(storyid, first_name, last_name, gender, hair_color, eye_color, hobby, age, occupation, dd_alignment, special_abilities)
    res.sendStatus(200)
})
app.get('/api/getChara/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let {storyid} = req.params

    let gotCharacters = await db.characters.get_characters(storyid)
    res.send(gotCharacters)
})

app.delete('/api/deleteChara/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let {storyid, characterid} = req.params

    let deletedChara = await db.characters.delete_chara(storyid, characterid)

    res.sendStatus(200)
})

app.get('/api/getCharaByid/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let {storyid, characterid} = req.params

    let gotCharacter = await db.characters.get_chara_by_id(storyid, characterid)
    // console.log(gotCharacter)
    res.send(gotCharacter)
})

app.post('/api/updateChara/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let {storyid, characterid} = req.params
    let {
        first_name,
        last_name,
        gender,
        hair_color,
        eye_color,
        hobby,
        age,
        occupation,
        dd_alignment,
        special_abilities 
    } = req.body

    let updatedChara = await db.characters.update_chara(storyid, characterid, first_name, last_name, gender, hair_color, eye_color, hobby, age, occupation, dd_alignment, special_abilities)
    res.sendStatus(200)
})

app.get('/api/logout', (req, res) => {
    req.session.destroy()
})


app.listen(SERVER_PORT, () => {
    console.log(`spellbound on port ${SERVER_PORT}`)
})