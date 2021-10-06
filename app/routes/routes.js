module.exports = app =>{
    const client = require('../controllers/clientController.js');

    const router = require('express').Router();


    router.get('/providers',client.getProviders);

    router.post('/add-client', client.addClient);

    router.post('/add-provider', client.addProvider);

    router.get('/client/:id', client.findByClientId);

    router.get("/client", client.getClients);

    router.get('/delete/client/:id', client.findAndDeleteClient);

    router.get('/delete/provider/:id', client.findAndDeleteProvider);

    router.post('/update/client/:id', client.findAndUpdateClient);

    app.use('/api', router);
}