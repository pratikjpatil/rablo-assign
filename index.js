require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./models/products")

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb://localhost:27017/productsDB";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true, //for unique productID
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

mongoose.connect(process.env.MONGO_URI, options, (err) => {
  if (err) console.log(err);
});




app.get("/", (req, res) => {
  res.render("home");
});

app.get("/viewall", (req, res) => {
  Product.find({}, (err, data) => {
    if (err) console.log(err);
    else res.render("viewall", { products: data });
  });
});

app.get("/featured", (req, res) => {
  Product.find({ isFeatured: true }, (err, data) => {
    if (err) console.log(err);
    else res.render("viewall", { products: data });
  });
});

app.get("/create", (req, res) => {
  res.render("create-update", {
    title: "Add product",
    route: "create",
    prodID: "",
    required: "required",
    desc: "This is required field.",
    msg: "",
    readonly: "",
  });
});

app.get("/filter", (req, res) => {
  res.render("filter");
});








app.post("/create", (req, res) => {
  const newProduct = new Product({
    productID: req.body.prodID,
    name: req.body.prodName,
    price: req.body.prodPrice,
    isFeatured: req.body.prodIsFeatured === "true" ? true : false,
    rating: req.body.prodRating,
    createdAt: req.body.prodDate,
    company: req.body.prodCompany,
  });

  newProduct.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.render("success");
});

app.post("/update", (req, res) => {
  Product.findOne({ productID: req.body.prodID }, (err, product) => {
    console.log(req.body.prodID);
    if (err) {
      console.log(err);
      res.render("failure");
    } else if (!product) {
      console.log("Product not found");
      res.render("failure");
    } else {
      const change = {
        name: req.body.prodName,
        price: req.body.prodPrice,
        isFeatured: req.body.prodIsFeatured === "true" ? true : false,
        rating: req.body.prodRating,
        createdAt: req.body.prodDate,
        company: req.body.prodCompany,
      };
      Product.findOneAndUpdate(
        { productID: req.body.prodID },
        change,
        (err, data) => {
          if (err) {
            console.log(err);
            res.render("failure");
          } else {
            res.render("success");
            console.log("Data updated!");
          }
        }
      );
    }
  });
});

app.post("/delete", (req, res) => {
  Product.deleteOne({ _id: req.body._ID }, function (err, data) {
    if (err) {
      console.log(err);
      res.redirect("/failure");
    } else {
      res.redirect("/viewall");
    }
  });
});

app.post("/plt", async (req, res) => {
  //to show products with price less than given price
  const price = req.body.prodPrice;

  try {
    const products = await Product.find({ price: { $lt: price } });
    res.render("viewall", { products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/rgt", async (req, res) => {
  //to show products with price less than given price
  const rating = req.body.prodRating;

  try {
    const products = await Product.find({ rating: { $gt: rating } });
    res.render("viewall", { products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/updt", (req, res) => {
  const ID = req.body.prodID;
  console.log(ID);
  res.render("create-update", {
    title: "Update product details",
    route: "update",
    prodID: ID,
    required: "",
    desc: "Check the product ID.",
    msg: "Add full information of the product.",
    readonly: "readonly",
  });
});




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
