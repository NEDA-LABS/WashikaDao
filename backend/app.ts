require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8080;

const app = express();

//Endpoints to be used
app.use("/", require("./routes/homePageHandler.ts"));//HomePage
app.use("/funguaDao", require("./routes/funguaDaoPageHandler.ts"));//funguaDao Page
app.use("/jifunze", require("./routes/jifunzePageHandler.ts"));//Elimu/Jifunze Page
app.use("/daoToolKit", require("./routes/daoToolKitPageHandler.ts"));//daoToolKit Page
app.use("/jiungeNaDao", require("./routes/jiungeNaDaoPageHandler.ts"))//jiungeNaDao Page

const server = app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
})
