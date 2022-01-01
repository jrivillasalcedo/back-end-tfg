const express = require('express');
const middlewares = require('./middlewares');
require('./database');

const usersRoutes = require('./users/users.router').router;

const app = express();

const port = 3000;

middlewares.setupMiddlewares(app);
app.use('/users', usersRoutes);

app.listen(port, () => {
    console.log('Server started at port 3000');
})

exports.app = app;