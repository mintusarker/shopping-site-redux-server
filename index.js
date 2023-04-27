const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express()
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl1tykd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('productName').collection('products')

        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });
        });

        // app.get('/product', async (req, res) => {
        //     const query = {};
        //     const products = await productCollection.find(query).toArray();
        //     res.send(products);
        // });

        app.post('/products', async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
            res.send(result);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result)
        });

    }
    finally {

    }
}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('server running')
})


app.listen(port, () => console.log(`server running on ${port}`))