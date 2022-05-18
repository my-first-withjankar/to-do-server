const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.tjkq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();

        const taskCollection = client.db("to-do").collection("tasks");


        app.get('/task', async (req, res) => {
            const query = {}
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks)
        })




        app.post('/task', async (req, res) => {
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            res.send(result)
        })


        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectID(id) };
            const result = await taskCollection.deleteOne(query)
            res.send(result)

        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('my todo')
})

app.listen(port, () => {
    console.log(`listening port ${port}`);
})
