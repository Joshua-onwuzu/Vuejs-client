const db = require('../models');

const defaultClient = require('./defaults/defaultClient.js');

const defaultProvider = require('./defaults/defaultProvider.js')

const Client = db.client ;

const Provider = db.provider ;

const Table = db.table ;

let count = null ;


const createProvider = async ()=>{
    const execute = await  Provider.find({},);
    if(execute.length == 0){
        const doIt = await Provider.insertMany(defaultProvider);
        const client = await Client.insertMany(defaultClient)
        if (doIt){
            Table.find({},(err,tdata)=>{
                if (tdata.length === 0){
                    try{
                        Provider.find({},(err,pdata)=>{
                            if(pdata.length > 0){
                                Client.find({},(err,cdata)=>{
                                    if (cdata.length > 0){
                                        const newTable = new Table ({
                                            client : [...cdata],
                                            provider : [...pdata]
                                        });
                                        newTable.save();
                                    }
                                })
                            }
                        });
                    } catch (err){
                        console.log(err);
                    }
            
                }
            });
        }
    }
}

createProvider();

Provider.find({},(err,data)=>{
    count = data.length + 1
})

exports.getProviders = (req,res)=>{
    Table.find({},(err,data)=>{
        res.status(200).send(data[0].provider)
    })
};


exports.addClient = (req,res)=>{

    try{
        const {name,email,phone,providerArray} = req.body;
    
        if (!name || !email || !phone || !providerArray){
    
            res.status(400).send({
                status : "fail",
                message : "all field required"
            })
        }
    
        const idArray = providerArray.map(eachId =>{
            return {
                id : eachId.id,
                name : eachId.name
            }
        })
    
        const newClient = new Client ({
            name : name,
            email : email,
            phone : phone,
            provider : [...idArray]
        })
    
        newClient.save((err,cdata)=>{
    
    
            Table.find({},(err,data)=>{
                Table.findOneAndUpdate({_id : data[0]._id}, {$push: {client : cdata}},{ 'new': true },(err,data)=>{
                    if(!err){
                        res.status(200).send({
                            status : "success",
                            message : "successfully saved client"
                        })
                    }
                })
            })
    
        })
    } catch (err){
        console.log(err);
    
        res.status(500).send(err);
    }
    
        
;
};

exports.addProvider = (req,res)=>{
    
    try{
        const name = req.body.provider;

        if (!name){
            res.status(400).send({
                status : "fail",
                message : "cannot add provider of name undefined"
            })
        }
        
        const newProvider = new Provider ({
            _id : count,
            name : name
        });
    
        newProvider.save((err,pdata)=>{
    
            Table.find({},(err,data)=>{
    
                Table.findOneAndUpdate({_id : data[0]._id}, {$push: {provider : pdata}},{ 'new': true },(err,data)=>{
                    if(!err){
                        res.status(200).send({
                            status : "success",
                            message : "successfully added a provider"
                        });
                    };
                })
            })
    
        });
        count++
    }catch(err){
        res.status(500).send(err);
    }
};


exports.findByClientId = (req,res)=>{
    Client.findOne({_id : req.params.id},(err,data)=>{
        
        if(data == null){
            res.status(404).send({
                status : "fail",
                message : "client not found"
            })
        }else{
            res.status(200).send(data)
        }

        

    })
};


exports.getClients =  (req,res)=>{

    Client.find({},(err,data)=>{

        if(err){
            res.status(500).send(err)
        }

        res.status(200).send(data)

    })
};

exports.findAndDeleteClient = (req,res)=>{

    try{
        Table.find({},(err,tdata)=>{

            if(!err){
    
                Client.findOne({_id : req.params.id},(err,data)=>{
    
                    if (data == null){
                        res.status(404).send({
                            status : "fail",
                            message : "unrecognized client id"
                        })
                    };
    
                    const clientName = data.name
    
                    Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {client :{name : clientName}}},{ 'new': true },(err,data)=>{
    
                        Client.findByIdAndRemove(req.params.id, (err)=>{
    
                            if(err){
                                res.status(500).send(err)
                            }
    
                            res.status(200).send({
                                status : "success",
                                message : "sucessfully deleted"
                            })
                        })
                    } )
                })
            }
        })
    }catch(err){
        console.log(err)

        res.status(500).send(err)
    }

};


exports.findAndDeleteProvider =  (req,res)=>{
    try{
        Table.find({},(err,tdata)=>{
            if(!err){
    
                Provider.findOne({_id : req.params.id},(err,data)=>{
    
                    if(err){
                        res.status(404).send({
                            status : "fail",
                            message : "unrecognized provider id"
                        })
                    }
    
                    const providerName = data.name
    
                    Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {provider :{name : providerName}}},{ 'new': true },(err,data)=>{
    
                        if(err){
                            res.status(500).send({
                                status : "fail",
                                message : "failed to delete provider"
                            })
                        }
    
                        Provider.findByIdAndRemove(req.params.id, (err)=>{
                            if(!err){
                                res.send({
                                    status : "success",
                                    message : "provider sucessfully deleted"
                                });
                            }
                        });
                    })
                })
            }
        })
    } catch (err){
        res.status(500).send(err)
    }
};


exports.findAndUpdateClient = (req, res)=>{
    try{
        
        const {name,email,phone} = req.body ;

        if(!name && !email){
           const request = req.body.phone
           Client.findOneAndUpdate({_id : req.params.id},{phone : request},{ new: true },(err,data)=>{
            if(!err){
                const clientData = {
                    name : data.name,
                    email : data.email,
                    phone : data.phone,
                    provider : data.provider
                }
                Table.find({},(err,tdata)=>{
                     if(!err){
                         Table.findOneAndUpdate({_id :tdata[0]._id }, {$pull : {client :{name : data.name}}},(err,data)=>{
                             if(!err){
                                 Table.findOneAndUpdate({_id : tdata[0]._id},{$push: {client : clientData}},(err,data)=>{
                                     if(!err){
                                        res.status(200).send({
                                            status : "success",
                                            message : "client edited successfully"
                                        })                                         
                                     }
                                 } )
                             }
                         })
                     }
                })
            }
        })

        }

        if(!name && !phone){
            const request = req.body.email
            Client.findOneAndUpdate({_id : req.params.id},{email : request},{ new: true },(err,data)=>{
                if(!err){
                    const clientData = {
                        name : data.name,
                        email : data.email,
                        phone : data.phone,
                        provider : data.provider
                    }
                    Table.find({},(err,tdata)=>{
                         if(!err){
                             Table.findOneAndUpdate({_id :tdata[0]._id }, {$pull : {client :{name : data.name}}},(err,data)=>{
                                 if(!err){
                                     Table.findOneAndUpdate({_id : tdata[0]._id},{$push: {client : clientData}},(err,data)=>{
                                         if(!err){
                                            res.status(200).send({
                                                status : "success",
                                                message : "client edited successfully"
                                            })                                         
                                         }
                                     } )
                                 }
                             })
                         }
                    })
                }
            })            
        }
        
        if(!email && !phone){
            const request = req.body.name
            Client.findOneAndUpdate({_id : req.params.id},{name : request},{ new: true },(err,data)=>{
                if(!err){
                    const clientData = {
                        name : data.name,
                        email : data.email,
                        phone : data.phone,
                        provider : data.provider
                    }
                    Table.find({},(err,tdata)=>{
                         if(!err){
                             Table.findOneAndUpdate({_id :tdata[0]._id }, {$pull : {client :{email : data.email}}},(err,data)=>{
                                 if(!err){
                                     Table.findOneAndUpdate({_id : tdata[0]._id},{$push: {client : clientData}},(err,data)=>{
                                         if(!err){
                                            res.status(200).send({
                                                status : "success",
                                                message : "client edited successfully"
                                            })                                         
                                         }
                                     } )
                                 }
                             })
                         }
                    })
                }
            })            
        }

    }catch (err){
        res.status(500).send(err)
    }


};