const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');

// middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authJwt());

// Routes

const api = process.env.API_URL;
const productRoutes = require('./routers/products');
const userRoutes = require('./routers/users');
const categoryRoutes = require('./routers/categories');
const orderRoutes = require('./routers/orders');

app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

// database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Connected with database!!!!');
  })
  .catch((err) => {
    console.log('Database Connection failed' + err);
  });

// Starting port
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
