const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatDatabase',{
    useNewUrlParser: true
})
    .then(db => console.log('Db is connected'))
    .catch(err => console.err(err));