const express = require("express");
const router = express.Router();
const Sudoku = require("ffg-sudoku");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
}, express.json());

router.get("/", (req, res) => {
  res.render("api");
});

router.get("/puzzle", async (req, res) => {
  let difficulty = req.query.difficulty || "random";
  let type = req.query.type || "rows";
  let sudoku = await Sudoku.generate({type: type, difficulty: difficulty});
  res.status(200).json(sudoku);
});

router.post("/solve", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.board)) return res.status(400).json({
    status: 400,
    message: "Missing Parameters."
  });
  let {type, board} = req.body;
  let sudoku = await Sudoku.solve(board, type);
  res.status(200).json(sudoku);
});

router.post("/grade", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.board)) return res.status(400).json({
    status: 400,
    message: "Missing Parameters."
  });
  let {type, board} = req.body;
  let sudoku = await Sudoku.grade(board);
  res.status(200).json(sudoku);
});

router.post("/validate", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.board)) return res.status(400).json({
    status: 400,
    message: "Missing Parameters."
  });
  let {type, board} = req.body;
  let sudoku = await Sudoku.validate(board, type);
  res.status(200).json(sudoku);
});

router.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found."
  });
});

module.exports = router;
