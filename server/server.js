require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { globalErrorHandler } = require('./controllers/errorController');

const { join } = require('path');
const cookieParser = require('cookie-parser');
const { connectDb } = require('./utils/dbConnection');
const { checkUserStatus } = require('./controllers/chatControllers');
const SendOperationalError = require('./utils/sendOperationalError');

//express setup
const app = express();

//view engine setup
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

//cors setup
// https://www.mozbotchat.com
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Db connection
connectDb();

//view routes
app.use('/', require('./routes/viewRoutes'));
app.use('/', require('./routes/viewRoutes'));
app.use('/', require('./routes/viewRoutes'));

//server routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/chatRoutes'));
app.use('/', require('./routes/adminRoutes'));

app.all('*', (req, res, next) => {
  next(
    new SendOperationalError(`Rota não encontrada: ${req.originalUrl}`, 404)
  );
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`App rodando na porta: ${port}`);
});
