const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const apiRouter = require("./routes/api");

app.set("view engine", "ejs");
app.set("views", "views");
app.set("json spaces", 2);

app.use("/js", express.static(path.join(__dirname, "js")), (req, res) => {
  res.render("error", {
    status: 404,
    message: "Script Not Found."
  });
});

app.use("/css", express.static(path.join(__dirname, "css")), (req, res) => {
  res.render("error", {
    status: 404,
    message: "Stylesheet Not Found."
  });
});

app.use("/images", express.static(path.join(__dirname, "images")), (req, res) => {
  res.render("error", {
    status: 404,
    message: "Image Not Found."
  });
});

app.get("/", (req, res) => {
  fs.readFile("./README.md", "utf8", (err, file) => {
    if (err) {
      return res.json({status: err.number, message: err.message});
    }
    let data = {
      "text": file,
      "mode": "gfm",
      "context": "FFGFlash/ffg-sudoku"
    }
    fetch("https://api.github.com/markdown", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    }).then(res=>res.text()).then(data => {
      res.render("index", {
        readme: data
      });
    }).catch(err => {
      res.json({data: JSON.stringify(data), status: err.number, message: err.message});
    });
  });
});

app.get("/play", (req, res) => {
  res.render("game");
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.render("error", {
    status: 404,
    message: "Page Not Found."
  });
});

server.listen(process.env.PORT || 80);
