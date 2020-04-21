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

router.get("/puzzle", async (req, res) => {
  let difficulty = req.query.difficulty || "random";
  let type = req.query.type || "rows";
  let sudoku = await Sudoku.generate({type: type, difficulty: difficulty});
  res.json(sudoku);
});

router.post("/solve", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.difficulty && req.body.board)) return next();
  let {type, board, difficulty} = req.body;
  let sudoku = await new Sudoku(board, type, difficulty).solve();
  res.json(sudoku);
});

router.post("/grade", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.difficulty && req.body.board)) return next();
  let {type, board, difficulty} = req.body;
  let sudoku = await new Sudoku(board, type, difficulty).grade();
  res.json(sudoku);
});

router.post("/validate", async (req, res, next) => {
  if (!(req.body && req.body.type && req.body.difficulty && req.body.board)) return next();
  let {type, board, difficulty} = req.body;
  let sudoku = await new Sudoku(board, type, difficulty).validate();
  res.json(sudoku);
});

module.exports = router;
