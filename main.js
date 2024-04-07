const cors = require("cors");
const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const URI =
    "mongodb+srv://saipavananand08:test123@cluster0.sa0hhhv.mongodb.net/";
const client = new MongoClient(URI);
const port = process.env.port;
async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error occured while connecting to MONGO");
    }
}
app.use(cors());
app.use(express.json());
connectToDB();

app.get("/", (req, res) => {
    res.status(200).send("GET API triggered");
});

app.get("/products", async (req, res) => {
    try {
        const db = client.db("ecommerce");
        const products = await db.collection("products").find().toArray();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const db = client.db("ecommerce");
        const id = req.params.id;
        const result = await db.collection("products").findOne({_id: new ObjectId(id)});
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error });
    }
});

app.post("/products", async (req, res) => {
    try {
        const db = client.db("ecommerce");
        const result = db.collection("products").insertOne(req.body, {returnOriginal: true});
        res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const db = client.db("ecommerce");
        const { name, q, price } = req.body;
        const id = req.params.id;
        const query = { $set: { name, q, price } };
        const result = await db.collection("products")
        .findOneAndUpdate({ _id: new ObjectId(id) }, query, {returnOriginal: false});
        res.status(200).json({message: "Product updated!", result});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error });
    }
});

app.delete("/products/:id", (req, res) => {
    try {
        const db = client.db("ecommerce");
        const collection = db.collection("products");
        const id = req.params.id;
        const result = collection.findOneAndDelete({ _id: new ObjectId(id) }, {includeResultMetadata: true});
        res.status(200).json({ message: "Product deleted", deletedProduct: result });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error });
    }
});

app.listen(port, () => {
    console.log("Application running on port "+ port);
});
