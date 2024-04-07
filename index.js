const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(express.json());

let products = [{
    id:1,
    name: "Apple",
    q: 20,
    price: 20
},{
    id:2,
    name: "Bananna",
    q: 10,
    price: 10
},{
    id:3,
    name: "Milk",
    q: 200,
    price: 30
}]
app.get("/", (req,res) => {
    res.status(200).send("GET API triggered");
});

app.get("/products", (req, res) => {
    res.status(200).json({products});
});

app.post("/products", (req, res) => {
    console.log(req.body);
    const product = req.body;
    products.push(product);
    res.status(200).json({products});
});

app.put("/products/:id", (req, res) => {
    console.log(req.body);
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    products = products.map(prod => {
        if (prod.id === id) {
            console.log("if cond");
            return {...prod, ...updatedProduct}
        } else {
            return prod;
        }
    })
    res.status(200).json({products});
});

app.delete("/products/:id", (req,res) => {
    const id = parseInt(req.params.id);
    console.log({id});
    products = products.filter(prod => prod.id !== id);
    res.status(200).json({products});
});

app.listen(3000, ()=> {
    console.log("Application running on port 3000");
});