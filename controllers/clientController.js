class ClientController {
    index (req, res){
            res.sendFile(__dirname + "/src/index.html");
    }
}

module.exports = ClientController