const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

mongoose.connect(uri, options, (err) => {
  if (err) console.log(err);
});

const productSchema = {
  productID: {
    type: String,
    required: [true, "Product must have ID"],
    unique: true,
  },

  name: {
    type: String,
    required: [true, "Product must have Name"],
  },

  price: {
    type: Number,
    required: [true, "Product must have Price"],
  },
  isFeatured: {
    type: Boolean,
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
  createdAt: {
    type: Date,
    required: [true, "Product must have its creation date"],
  },
  company: {
    type: String,
    required: [true, "Product must have company name"],
  },
};

const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("allproducts");
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
    else res.send(data);
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.get("/failure", (req, res) => {
  res.render("failure");
});
app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/create", (req, res) => {
  // if(req.body.prodIsFeatured === 'true')
  // var featureStatus = true;
  // else featureStatus = false;

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
  res.redirect("/");
});

// app.post("/update", (req, res)=> {
//   const change = {
//     name: req.body.prodName,
//     price: req.body.prodPrice,
//     isFeatured: req.body.prodIsFeatured,
//     rating: req.body.prodRating,
//     createdAt: req.body.prodDate,
//     company: req.body.prodCompany,
//   };
//   Product.findOneAndUpdate(
//     { productID: req.body.prodID },
//     change,
//     (err, data) => {
//       if (err) {
//         console.log(err);
//         res.redirect("/failure");
//       } else {
//         res.redirect('/success');
//         console.log("Data updated!");
//       }
//     }
//   );
//});

app.post("/update", (req, res) => {
  Product.findOne({ productID: req.body.prodID }, (err, product) => {
    if (err) {
      console.log(err);
      res.redirect("/failure");
    } else if (!product) {
      console.log("Product not found");
      res.redirect("/failure");
    } else {
      const change = {
        name: req.body.prodName,
        price: req.body.prodPrice,
        isFeatured: req.body.prodIsFeatured,
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
            res.redirect("/failure");
          } else {
            res.redirect("/success");
            console.log("Data updated!");
          }
        }
      );
    }
  });
});

app.post("/delete", (req, res) => {
  Product.deleteOne({ productID: req.body.prodID }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.post("/plt", (req, res) => {
  //price less than
  Product.find({ price: { $lte: req.body.prodPrice } }, (err, data) => {
    if (err) console.log(err);
    else res.send(data);
  });
});

app.post("/rgt", (req, res) => {
  //rating greater than
  Product.find({ rating: { $gte: req.body.prodRating } }, (err, data) => {
    if (err) console.log(err);
    else res.send(data);
  });
});

app.post("/viewall", (req, res) => {
  res.redirect("/viewall");
});

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
