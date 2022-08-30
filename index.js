const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()


// middleware
app.use(cors())
app.use(express.json())

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbiden access" })
        }
        console.log(decoded, "decoded")
        req.decoded = decoded
        next()
    })

}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odsjfxq.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })





async function run() {

    try {
        await client.connect()
        const productsCollection = client.db("carcollection").collection("services")



        app.post("/login", async (req, res) => {
            const user = req.body

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

            // console.log(accessToken)
            res.send({ accessToken })
        })

        // find all inventory
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // post a single inventory
        app.post("/inventory", async (req, res) => {
            const newitem = req.body
            const result = await productsCollection.insertOne(newitem)
            res.send(result)
        })


        // find a single inventory
        // details item
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })




        //   // update stock
        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }

            const updateDoc = {
                $set: {
                    quantity: req.body.newQuantity,
                },
            }
            const result = await productsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // delete a single inventory
        app.delete("/inventory/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })


        // My items
        app.get('/myitems/:email', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.params.email
            if (email === decodedEmail) {
                const query = { email: email }
                const cursor = await productsCollection.find(query).toArray()
                res.send(cursor)
            }
            else {
                res.status(403).send({ message: "Fotbiden access" })
            }
        })



    } finally {

    }
}

run().catch(console.dir)

app.post("/", (req, res) => {
    res.send("Gemus Server Running")
})


// middleware
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Running Genius Server hello")
})

app.listen(port, () => {
    console.log("Listening to port", port)
})



