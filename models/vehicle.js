const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    // Define vehicle schema
    const vehicleSchema = new mongoose.Schema({
        userId :Number,
        idcar: Number,
        model: String,
        registration: String,
    });
    const vehicle =mongoose.model("vehicle",vehicleSchema)
module.exports=vehicle