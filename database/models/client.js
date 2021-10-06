const mongoose= require("mongoose");


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



const Client = mongoose.model("Client",clientSchema);


module.exports = Client