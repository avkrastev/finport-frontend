const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const cryptoRoutes = require('./routes/crypto');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/crypto', cryptoRoutes);

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res
        .status(error.code || 500)
        .json({
            message: error.message || 'An unknown error ocurred!'
        });
})

mongoose
    .connect('mongodb+srv://avkrastev:1q221q22@cluster0.e1w4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority') 
    .then(() => {
        app.listen(3005);
    })
    .catch(err => {
        console.log(err)
    });
