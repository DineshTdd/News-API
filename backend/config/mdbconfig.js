const mongoose = require('mongoose');
const mclient = {};
//Connect to DB
mclient.mconnect = () => {
    const dbUrl = `mongodb+srv://${process.env.MONGOATLASDB_USER}:${process.env.MONGOATLASDB_PASSWORD}@news-api-mhad0.mongodb.net/${process.env.MONGOATLASDB_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Connection was established with MOngoAtlasDB!');
    })
    .catch((err) => {
        console.log(err,'Failed Connection');
    });
};

exports.mclient = mclient;
