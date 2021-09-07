const express = require("express");
const cors = require("cors");
const app = express();

require('dotenv').config({ path: './.env'});


var corsOptions = {
  origin: process.env.CLIENT_URL
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
  .connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado ao banco.");
  })
  .catch(err => {
    console.error("Erro ao conectar", err);
    process.exit();
  });


require("./app/routes/auth.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
