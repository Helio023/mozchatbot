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
app.use(cors());

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// app.use((req, res, next) => {
//   console.log(process.env.JWT_SECRET);
//   next()
// })

//Db connection
connectDb()

cron.schedule('1,2,3,4,5 * * * *', () => {
  checkUserStatus();
});

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
