const newClient1 = {
    name : "Test1",
    email : "wen@gmail.com",
    phone : 123456789,
    provider : [{id : 1, name : "Provider1"}]
};
const newClient2 = {
    name : "Test5",
    email : "wendy@gmail.com",
    phone : 123456789,
    provider : [{id : 3,name : "Provider3"},{id : 5, name : "Provider5"}]
};
const defaultClient = [newClient1,newClient2];

module.exports = defaultClient ;