const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

//load env vars
dotenv.config({ path: './config/config.env' });


const app = express();

//Body Parser
app.use(express.json());

//Enable cors 
app.use(cors());


// Routes

app.use('/api/v1/news', require('./routes/newsapi'));
app.use('/pgcollection/v1/news', require('./routes/pgcollection'));

const PORT= process.env.PORT || 5000;

app.listen(PORT, () =>console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) )