const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odsjfxq.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })





async function run() {

    try {
        await client.connect()
        const productsCollection = client.db("carcollection").collection("services")

        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        //  post item or add items

        app.post("/inventory", async (req, res) => {
            const newitem = req.body
            const result = await productsCollection.insertOne(newitem)
            res.send(result)
        })



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
            console.log(req.body)
            const filter = { _id: ObjectId(id) }

            const updateDoc = {
                $set: {
                    quantity: req.body.newQuantity,
                },
            }
            const result = await productsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // delete
        app.delete("/inventory/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })


        // My items
        app.get('/myitems/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const cursor = await productsCollection.find(query).toArray()
            res.send(cursor)
        })





        // // delevered items
        // app.put("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const updatedUser = req.body
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updateDoc = {
        //         $set: updatedUser
        //     }
        //     const result = await mobileCollection.updateOne(filter, updateDoc, options)
        //     res.send(result)
        // })

        // app.get("/hero", async (req, res) => {
        //     res.send("Herocu connected")
        // })
        // // add Quantity items

        // app.put("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const filter = { _id: ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             quantity: req.body.updateQuantity
        //         },
        //     }
        //     const result = await mobileCollection.updateOne(filter, updateDoc)
        //     res.send(result)
        // })

        // // deleted itemms
        // app.delete("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const result = await mobileCollection.deleteOne(query)
        //     res.send(result)
        // })


        // My items
        // app.get('/myitems', async (req, res) => {
        //     const email = req.query.email
        //     const query = { email: email }
        //     const cursor = productsCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })


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



