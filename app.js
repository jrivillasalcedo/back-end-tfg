const express = require('express');
const middlewares = require('./middlewares');
require('./database');

const authRoutes = require('./auth/auth.router').router;

const app = express();

const port = 3000;

middlewares.setupMiddlewares(app);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('Server started at port 3000');
})

exports.app = app;