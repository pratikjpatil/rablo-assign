const mongoose = require("mongoose");

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
  
 module.exports = mongoose.model("Product", productSchema);