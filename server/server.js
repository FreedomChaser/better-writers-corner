require('dotenv').config()
const express = require('express')
const session = require('express-session')
const axios = require('axios')
const massive = require('massive')
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_TEST_SECRET)

const app = express()

app.use( express.static( `${__dirname}/../build` ) );

app.use(bodyParser.json())

const {
    SERVER_PORT,
    REACT_APP_DOMAIN,
    REACT_APP_CLIENT_ID,
    CLIENT_SECRET,
    CONNECTION_STRING,
    SESSION_SECRET,
    DEV_KEY,
    AUTH_ID,
    REACT_APP_STRIPE_TEST_PUBLISHABLE,
    REACT_APP_STRIPE_TEST_SECRET,
    PROTOCOL
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
        redirect_uri: `${PROTOCOL}://${req.headers.host}/auth/callback`
    }
    let resWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload)
    let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo/?access_token=${resWithToken.data.access_token}`)

    const db = req.app.get('db')
    let { sub, email } = resWithUserData.data

    let foundUser = await db.login.find_user([sub])

    if (foundUser[0]) {
        req.session.userid = foundUser[0].userid
        res.redirect('/#/home')
    } else {
        let createdUser = await db.login.create_user(email, sub)
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
        if (req.session.userid) {
            let{userid} = req.session
            res.status(200).send({ userid })
        } else {
            res.status(401).send('Please Login')
        }
    }
})

app.get('/api/getStories', async (req, res) => {
    const db = req.app.get('db')
    let { userid } = req.session

    let count = await db.stories.get_stories_count(userid)
    let stories = await db.stories.get_stories(userid)

    res.send({ count, stories })
})

app.delete('/api/deleteStory/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let { userid } = req.session
    let { storyid } = req.params

    let deletedStory = await db.stories.delete_story(userid, storyid)

    res.sendStatus(200)
})

app.post('/api/addStory', async (req, res) => {
    const db = req.app.get('db')
    let { userid } = req.session
    let { title } = req.body

    let addedStory = db.stories.add_story(userid, title)

    res.sendStatus(200)
})

app.post('/save-stripe-token', async (req, res) => {
    const db = req.app.get
    const { token } = req.body
    // let { userid } = req.sessions

    const charge = stripe.charges.create({
        amount: 100,
        currency: 'usd',
        description: 'Writers Corner',
        source: token,
        capture: false,
    })

    res.sendStatus(200)

    // add a column for customerid to db
    //fix add customer feature 
    // let foundCustomer = await db.login.find_customer(userid)

    // if (foundCustomer) {

    //     const charge = await stripe.charges.create({
    //         amount: 100,
    //         currency: 'usd',
    //         customer: foundCustomer
    //     })

    //     res.sendStatus(200)

    // } else {
    //     const customer = await stripe.customers.create({
    //         source: token,
    //         email: ''
    //     })

    //     // req.session.customerid = customer.id

    //     const charge = await stripe.charges.create({
    //         amount: 100,
    //         currency: 'usd',
    //         customer: customer.id,
    //         // source: token
    //     })

    //     let createdCustomer = await db.login.add_customer_id(customer)

    //     res.sendStatus(200)
    // }
})

app.post('/api/addChara/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid } = req.params
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
    let { storyid } = req.params

    let gotCharacters = await db.characters.get_characters(storyid)
    res.send(gotCharacters)
})

app.delete('/api/deleteChara/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid, characterid } = req.params

    let deletedChara = await db.characters.delete_chara(storyid, characterid)

    res.sendStatus(200)
})

app.get('/api/getCharaByid/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid, characterid } = req.params

    let gotCharacter = await db.characters.get_chara_by_id(storyid, characterid)
    // console.log(gotCharacter)
    res.send(gotCharacter)
})

app.post('/api/updateChara/:storyid/:characterid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid, characterid } = req.params
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

app.get('/api/getPlotContent/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid } = req.params
    let tree2
    let tree3
    try {
        let titles = await db.plot.get_tree_titles(storyid)
        // console.log(titles[0].treeid)
        let tree1 = await db.plot.get_tree(titles[0].treeid, storyid)
        if (titles[1]) {
            tree2 = await db.plot.get_tree(titles[1].treeid, storyid)
        }
        if (titles[2]) {
            tree3 = await db.plot.get_tree(titles[2].treeid, storyid)
        }
        if (titles[2]) {
            res.send({ titles, tree1, tree2, tree3 })
        } else if (titles[1]) {
            res.send({ titles, tree1, tree2 })
        } else {
            res.send({ titles, tree1 })
        }
        // .catch(err => console.log(err))

    } catch (e) { console.log(e) }
})

app.get('/api/tree/:treeid/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let { treeid, storyid } = req.params

    let tree = await db.plot.get_tree(treeid, storyid)

    res.send(tree)
})

app.post('/api/createPlotCard/:treeid', async (req, res) => {
    const db = req.app.get('db')
    let { treeid } = req.params
    let { titleInput, summaryInput } = req.body

    let createdPlot = await db.plot.create_plot_card(treeid, titleInput, summaryInput)

    res.sendStatus(200)
})

app.delete('/api/deletePlotCard/:treeid/:plotid', async (req, res) => {
    const db = req.app.get('db')
    let { treeid, plotid } = req.params

    let deletedCard = await db.plot.delete_plot_card(treeid, plotid)

    res.sendStatus(200)
})

app.put('/api/editPlotCardTitle/:treeid/:plotid', async (req, res) => {
    const db = req.app.get('db')
    let { treeid, plotid } = req.params
    let { titleInput } = req.body

    let updatedTitle = await db.plot.update_plot_card_title(treeid, plotid, titleInput)

    res.sendStatus(200)
})

app.put('/api/editPlotCardSum/:treeid/:plotid', async (req, res) => {
    const db = req.app.get('db')
    let { treeid, plotid } = req.params
    let { summaryInput } = req.body

    let updatedSum = await db.plot.update_plot_card_sum(treeid, plotid, summaryInput)

    res.sendStatus(200)
})

app.post('/api/createTree/:storyid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid } = req.params
    let { treeInput } = req.body

    let newTree = await db.plot.create_tree(storyid, treeInput)
    res.send(newTree)
})

app.put('/api/updateTree/:storyid/:treeid', async (req, res) => {
    const db = req.app.get('db')
    let { storyid, treeid } = req.params
    let { treeInput } = req.body

    let updatedTree = await db.plot.update_tree(storyid, treeInput, treeid)
    let titles = await db.plot.get_tree_titles(storyid)

    res.send({ updatedTree, titles })
})

app.put('/api/setOrder', async (req, res) => {
    const db = req.app.get('db')
    let { orderedTree } = req.body
    // console.log(orderedTree)
    let order = await orderedTree.forEach(order => { db.plot_card.save(order) })
    // let newOrder
    //have the return query include an order by plot_order(I think ascending) and send that array to the front, then I shouldn't need to change anything on the front end
    res.sendStatus(200)
        .catch(err => {
            console.log(err)
        })
})

app.get('/api/logout', (req, res) => {
    req.session.destroy()
})


app.listen(SERVER_PORT, () => {
    console.log(`spellbound on port ${SERVER_PORT}`)
})