const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/mern",
  {
    useMongoClient: true
  }
);

require("./routes/api-routes.js")(app);

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});