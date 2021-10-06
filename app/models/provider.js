module.exports = mongoose =>{
    const providerSchema =new mongoose.Schema({
        _id : Number,
        name : String
    });
    
    
    const Provider = mongoose.model("Provider",providerSchema);

    return Provider;
};
