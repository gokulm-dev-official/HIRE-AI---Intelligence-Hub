const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing connection to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connection successful');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error details:', err);
        process.exit(1);
    });
