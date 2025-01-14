const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const MONGODB_URI =
// 'mongodb+srv://rebelthyworld:Forgot%402692_@cluster0.mq49lnp.mongodb.net/messagesDb?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI =
  'mongodb+srv://root:root@cluster0.q4mse.mongodb.net/messagesDb?retryWrites=true&w=majority&appName=Cluster0';

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const { error } = require('console');

app.use(bodyParser.json()); //for applicaiton/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // response.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, PUT, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: 'Please check the data',
    data: data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('MONGOOSE CONNECTED');
    const server = app.listen(8080); //gives a http server
    const io = require('./socket').init(server); //use http server to build up socket connection
    io.on('connection', (socket) => {
      //socket is a connection between server and client
      //whenever new conneciton comes, this function is executed
      console.log('CLIENT CONNECTED');
    });
  })
  .catch((err) => console.log(err));
