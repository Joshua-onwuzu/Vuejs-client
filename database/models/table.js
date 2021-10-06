const mongoose= require("mongoose");




const providerSchema = new mongoose.Schema({
    _id : Number,
    name : String
});



const clientProviderSchema = new mongoose.Schema ({
    id : {type : Number, ref : 'Provider'},
    name : String
});



const clientSchema =new mongoose.Schema({
    name : String,
    email : String,
    phone : Number,
    provider : [clientProviderSchema]
});




const tableSchema =new mongoose.Schema({
    client : [clientSchema],
    provider : [providerSchema]
});


const Table = mongoose.model("Table",tableSchema);


module.exports = Table;