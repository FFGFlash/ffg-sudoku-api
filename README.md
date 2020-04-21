# FFG Sudoku API
![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg/250px-Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg.png)
![](https://i.imgur.com/A2mmGSk.png)
![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Sudoku_Puzzle_by_L2G-20050714_solution_standardized_layout.svg/250px-Sudoku_Puzzle_by_L2G-20050714_solution_standardized_layout.svg.png)
## Overview
Sudoku Web API used to solve, generate, grade and validate [Sudokus](https://en.wikipedia.org/wiki/Sudoku).
## API
`https://ffg-sudoku.herokuapp.com/api`
### Get
#### /api/puzzle
##### Arguments:
- Difficulty:
    * beginner
    * intermediate
    * advanced
    * expert
    * random
##### Example:
`https://ffg-sudoku.herokuapp.com/api/puzzle?difficulty=beginner`
##### Response:
```json
{
    "type": "rows",
    "difficulty": "beginner",
    "status": 9,
    "board": [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ]
}
```
### Post
#### /api/solve
##### Arguments:
- Board: A 2d array of values
- Type:
    * rows (default)
    * nonets
    * columns
##### Example:
```js
let data = {"type":"rows","board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]};
fetch("https://ffg-sudoku.herokuapp.com/api/solve", {
    "method": "POST",
    "body": JSON.stringify(data),
    "headers": {"Content-Type": "application/json"}
}).then(res => res.json()).then(console.log).catch(console.warn);
```
##### Response:
```json
{
    "type": "rows",
    "difficulty": "beginner",
    "status": 5,
    "board": [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
    ]
}
```
#### /api/grade
##### Arguments:
- Board: A 2d array of values
##### Example:
```js
let data = {"type":"rows","board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]};
fetch("https://ffg-sudoku.herokuapp.com/api/grade", {
    "method": "POST",
    "body": JSON.stringify(data),
    "headers": {"Content-Type": "application/json"}
}).then(res => res.json()).then(console.log).catch(console.warn);
```
##### Response:
```json
{
    "difficulty": "beginner"
}
```
#### /api/validate
##### Arguments:
- Board: A 2d array of values
- Type:
    * rows (default)
    * nonets
    * columns
##### Example:
```js
let data = {"type":"rows","board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]};
fetch("https://ffg-sudoku.herokuapp.com/api/validate", {
    "method": "POST",
    "body": JSON.stringify(data),
    "headers": {"Content-Type": "application/json"}
}).then(res => res.json()).then(console.log).catch(console.warn);
```
##### Response:
```json
{
    "status": 9
}
```
