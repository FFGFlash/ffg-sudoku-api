const express = require("express");
const app = express();
const server = require("http").createServer(app);

app.set("view engine", "ejs");
app.set("views", "views");
app.set("json spaces", 2);

app.use("/css", express.static(path.join(__dirname, "css")), (req, res) => {
  res.render("error", {
    status: 404,
    message: "File Not Found."
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use((req, res) => {
  res.render("error", {
    status: 404,
    message: "Page Not Found."
  });
});

server.listen(process.env.PORT || 80);
