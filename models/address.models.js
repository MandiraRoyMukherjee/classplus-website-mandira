const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
    country: {type:String, required:true},
    zipCode: {type:Number, required:true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    street: {type: String, required: true},
    houseNumber: {type: String}
})
module.exports = mongoose.model("Address", addressSchema);