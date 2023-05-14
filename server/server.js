require('dotenv').config({path: '.env'})
const express = require('express');
const cors = require('cors');
const cron = require('node-cron')


const { join } = require('path');
const cookieParser = require('cookie-parser')
const {connectDb} = require('./utils/dbConnection');
const { checkUserStatus } = require('./controllers/chatControllers');



//express setup
const app = express();

//view engine setup
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

//cors setup
app.use(cors({
  origin: 'https://www.mozbotchat.com'
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.mozbotchat.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// app.use((req, res, next) => {
//   console.log(process.env.JWT_SECRET);
//   next()
// })

//Db connection
connectDb()

//view routes
app.use('/', require('./routes/viewRoutes'));
app.use('/', require('./routes/viewRoutes'));
app.use('/', require('./routes/viewRoutes'));

//server routes
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/chatRoutes'))
app.use('/', require('./routes/adminRoutes'))

const port = process.env.PORT || 3000

app.listen(3000, () => {
  console.log(`App rodando na porta: ${port}`);
});
