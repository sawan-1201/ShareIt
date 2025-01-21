require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        //useCreateIndex: true,
        useUnifiedTopology: true,
        //useFindAndModify: false // Correct option name
    });

    const connection = mongoose.connection;

    connection.on('error', (error) => {
        console.error('Database connection error:', error);
    });

    connection.once('open', () => {
        console.log('Database connected');
    });
}

module.exports = connectDB;