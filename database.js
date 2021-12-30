const mongoose = require('mongoose');
require('dotenv').config();

let password = process.env.DATABASE_PASSWORD;
let databaseName = process.env.DATABASE_NAME;
if (process.env.NODE_ENV === 'test') {
    databaseName = 'testdb';
}

mongoose.connect(`mongodb+srv://jrivilla:${password}@cluster0.jbdtz.mongodb.net/${databaseName}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true});