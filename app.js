const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bookRoutes = require("./routes/books");

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
