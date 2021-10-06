const mongoose= require("mongoose");


const providerSchema =new mongoose.Schema({
    _id : Number,
    name : String
});


const Provider = mongoose.model("Provider",providerSchema);


module.exports = Provider ;