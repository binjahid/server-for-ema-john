const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

//user Name : emaJhon
//password : 2ljmqLUL6dzoVO4p
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mdbb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("ema_John");
    const productsCollection = database.collection("productsCollection");
    const orders = database.collection("orders");
    //GET Products API
    app.get("/products", async (req, res) => {
      // console.log(req.query);
      const cursor = productsCollection.find({});
      const count = await cursor.count();
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send({ products, count });
    });
    // POST Produts Keys API
    app.post("/products/keys", async (req, res) => {
      const productKeys = req.body;
      // console.log(productKeys);
      const query = { key: { $in: productKeys } };
      const products = await productsCollection.find(query).toArray();
      res.json(products);
    });
    //Get Order API
    app.post(
      ("/confirmorders",
      (req, res) => {
        const order = req.body;
        console.log(order);
      })
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("i am connected with server");
});
app.listen(port, () => {
  console.log("I am runnin from port ", port);
});
