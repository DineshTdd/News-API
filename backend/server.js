const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
//const fs = require('fs');
const morgan = require('morgan');
// const path = require('path');
const winston = require('./config/winston');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const { mclient } = require('./config/mdbconfig');
const verifyUser = require('./helpers/verifyToken');


//load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

/* create a write stream ( in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });

setup the logger for morgan
app.use(morgan('combined', { stream: accessLogStream }))
*/


// setup the logger for morgan and winston
app.use(morgan('combined', { stream: winston.stream }));

//Body Parser
app.use(express.json());


//Enable cors 
app.use(cors());

// connect to mongodb
mclient.mconnect();

// Routes
app.use('/api/user', authRoute);
app.use('/api/v1/news', verifyUser ,require('./routes/newsapi'));
app.use('/pgcollection/v1/news', verifyUser, require('./routes/pgcollection'));
app.use('/api/userdetails', verifyUser ,userRoute);



const PORT= process.env.PORT || 5000;

app.listen(PORT, () =>console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) )