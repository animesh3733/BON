const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const billRoutes = require('./routes/bill');

const app = express();
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/bill', billRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
