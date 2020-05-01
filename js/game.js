const theme = {
	difficultyColor: {
		beginner: "#16a085",
		intermediate: "#f39c12",
		advanced: "#d35400"
	},
	staticColor: {
		primary: "#2c3e50",
		invalid: "#c0392b",
		filled: "#27ae60"
	},
	inputColor: {
		primary: "#3498db",
		invalid: "#e74c3c",
		filled: "#2ecc71"
	}
};
const EASY = "beginner";
const NORMAL = "intermediate";
const HARD = "advanced";
const RANDOM = "random";

class Value {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.val = 0;
		this.subval = [];
		this.writable = true;
		this.invalid = false;
		this.filled = false;
	}

	setValue(val) {
		this.val = val;
	}
}

class Subsec {
	constructor(pos = {}, board) {
		this.x = pos.x;
		this.y = pos.y;
		this.values = [];
		if (this.x != undefined && this.y != undefined) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					this.values[i + j * 3] = new Value(i, j);
				}
			}
			board.nonets[this.x + this.y * 3] = this;
		} else if (this.x != undefined) {
			let {x} = Board.toValueCoords(this.x, 0);
			for (let i = 0; i < 3; i++) {
				let nonet = board.getNonetOfValue(this.x, i * 3);
				for (let j = 0; j < 3; j++) {
					this.values[x + (i * 3 + j) * 3] = nonet.getValue(x, j);
				}
			}
		} else if (this.y != undefined) {
			let {y} = Board.toValueCoords(0, this.y);
			for (let i = 0; i < 3; i++) {
				let nonet = board.getNonetOfValue(i * 3, this.y);
				for (let j = 0; j < 3; j++) {
					this.values[(i * 3 + j) + y * 3] = nonet.getValue(j, y);
				}
			}
		}
		this.values = this.values.filter(function (el) {
			return el != null && el != undefined;
		});
	}

	getValue(i, j) {
		return this.values[i + j * 3];
	}

	getInvalid() {
		let retVal = [];
		for (let value of this.values) {
			if (retVal.indexOf(value.val) != -1) continue;
			let count = 2;
			if (value.val != 0) {
				count = 0;
				for (let {val} of this.values) {
					if (val == value.val) count++;
				}
			}
			if (count > 1) {
				retVal.push(value);
				continue;
			}
		}
		return retVal;
	}
}

class Board {
	constructor() {
		this.nonets = [];
		this.initialized = false;
	}

	initialize(data) {
		console.log(data);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				new Subsec({x: i, y: j}, this);
			}
		}
		if (["nonets","rows","columns"].indexOf(data.type) != -1) {
			for (let i in data.board) {
				for (let j in data.board[i]) {
					if (data.board[i][j] == 0) continue;
					this[data.type][i].values[j].val = data.board[i][j];
					this[data.type][i].values[j].writable = false;
				}
			}
		}
		this.validate();
		this.initialized = true;
	}

	static toNonetCoords(i, j) {
		return {
			x: (Math.floor(i / 3) % 3 + 3) % 3,
			y: (Math.floor(j / 3) % 3 + 3) % 3
		};
	}

	static toValueCoords(i, j) {
		return {
			x: (i % 3 + 3) % 3,
			y: (j % 3 + 3) % 3
		};
	}

	static generateBoardData(difficulty) {
		return new Promise((resolve, reject) => {
			loadJSON(`/api/puzzle?difficulty=${difficulty}&type=nonets`, json => {
				resolve(json);
			});
		});
	}

	getNonetOfValue(i, j) {
		let {x, y} = Board.toNonetCoords(i, j);
		return this.nonets[x + y * 3];
	}

	getValue(i, j) {
		let nonet = this.getNonetOfValue(i, j);
		let {x, y} = Board.toValueCoords(i, j);
		return nonet.getValue(x, y);
	}

	get unusedValues() {
		let retVal = [];
		let values = this.values;
		let numbers = [1,2,3,4,5,6,7,8,9];
		for (let number of numbers) {
			if (this.getCount(number) < 9) retVal.push(number);
		}
		return retVal;
	}

	getCount(number) {
		let count = 0;
		let values = this.values;
		for (let {val} of values) {
			if (number == val) count++;
		}
		return count;
	}

	setValue(i, j, val) {
		let nonet = this.getNonetOfValue(i, j);
		let {x, y} = Board.toValueCoords(i, j);
		nonet.getValue(x, y).val = val;
		this.validate();
	}

	getRow(i) {
		return new Subsec({y: i % 9}, this);
	}

	getColumn(i) {
		return new Subsec({x: i % 9}, this);
	}

	get rows() {
		let rows = [];
		for (let i in this.nonets) {
			rows.push(this.getRow(i));
		}
		return rows;
	}

	get columns() {
		let columns = [];
		for (let i in this.nonets) {
			columns.push(this.getColumn(i));
		}
		return columns;
	}

	get values() {
		let values = [];
		let rows = this.rows;
		for (let i in rows) {
			for (let j in rows[i].values) {
				values.push(this.getValue(j, i));
			}
		}
		return values;
	}

	getData(type = "nonets") {
		if (["nonets", "rows", "columns"].indexOf(type) == -1) return;
		let data = {type:type,board:[]};
		let board = this[type];
		for (let i = 0; i < board.length; i++) {
			data.board[i] = [];
			for (let j = 0; j < board[i].values.length; j++) {
				data.board[i][j] = board[i].values[j].val;
			}
		}
		return data;
	}

	validate() {
		let invalid = [];
		let values = this.values;
		let unusedValues = this.unusedValues;
		for (let value of values) {
			value.invalid = false;
			value.filled = unusedValues.indexOf(value.val) == -1;
		}
		let rows = this.rows;
		let columns = this.columns;
		let nonets = this.nonets;
		for (let i in nonets) {
			console.log(i);
			invalid = invalid.concat(rows[i].getInvalid(), columns[i].getInvalid(), nonets[i].getInvalid())
		}
		return invalid.filter((value, index, arr) => {
			if (arr.indexOf(value) !== index) return false;
			value.invalid = true;
			return true;
		});
	}
}

let board = new Board();
let difficulty = EASY;
let cell = {};
let selection = {};

function setup() {
	let size = Math.min(innerWidth, innerHeight) * .9;
	let canvas = createCanvas(size, size);
	canvas.id("view");
  canvas.parent("game-container");
	strokeWeight(7);
	noFill();
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	Board.generateBoardData(difficulty).then(data => board.initialize(data));
}

function windowResized() {
	let size = Math.min(innerWidth, innerHeight) * .9;
	resizeCanvas(size, size);
}

function mouseClicked() {
	let p = selection;
	selection = {};
	if (cell.x != p.x || cell.y != p.y) {
		selection = cell;
		selection.value = board.getValue(selection.x, selection.y);
	}
}

let toggled = false;
function keyPressed() {
	if (keyCode == SHIFT) {
		toggled = !toggled;
	} else if (key == "n") {
		Board.generateBoardData(difficulty).then(data => board.initialize(data));
	} else if (key == "d") {
		switch(difficulty) {
			case EASY:
				difficulty = NORMAL;
				break;
			case NORMAL:
				difficulty = HARD;
				break;
			case HARD:
				difficulty = EASY;
				break;
		}
	}
	if (["0","1","2","3","4","5","6","7","8","9"].indexOf(key) == -1) return;

	let number = parseInt(key);
	if (!selection.value.writable) return;

	if (!toggled) {
		board.setValue(selection.x, selection.y, number);
	} else {
		if (number == 0) {
			board.getValue(selection.x, selection.y).subval = [];
			return;
		}
		let i = board.getValue(selection.x, selection.y).subval.indexOf(number);
		if (i != -1) {
			board.getValue(selection.x, selection.y).subval.splice(i, 1);
		} else {
			board.getValue(selection.x, selection.y).subval.push(number);
		}
		board.getValue(selection.x, selection.y).subval.sort((a, b) => a - b);
	}
}

function draw() {
	if (!board.initialized) return;
	let nonetSize = Math.min(width, height) / 3;
	let cellSize = nonetSize / 3;

	cell = {
		x: (Math.floor(mouseX / cellSize) % 9 + 9) % 9,
		y: (Math.floor(mouseY / cellSize) % 9 + 9) % 9
	};

	clear();
	stroke(theme.staticColor.primary);
	textSize(cellSize * .75);
	translate(width / 2, height / 2);
	push();
	noStroke();
	fill(theme.difficultyColor[difficulty]);
	rect(0, 0, width, height);
	pop();
	for (let nonet of board.nonets) {
		let x = nonet.x - 1;
		let y = nonet.y - 1;
		push();
		translate(x * nonetSize, y * nonetSize)
		rect(0, 0, nonetSize, nonetSize);
		for (let value of nonet.values) {
			let x = value.x - 1;
			let y = value.y - 1;
			push();
			strokeWeight(3);
			translate(x * cellSize, y * cellSize);
			rect(0, 0, cellSize, cellSize);
			if (value.writable) {
				if (value.invalid) fill(theme.inputColor.invalid);
				else if (value.filled) fill(theme.inputColor.filled);
				else fill(theme.inputColor.primary);
			} else {
				if (value.invalid) fill(theme.staticColor.invalid);
				else if (value.filled) fill(theme.staticColor.filled);
				else fill(theme.staticColor.primary);
			}
			if (value.val) {
				text(value.val, 0, 0);
			} else if (value.subval) {
				push();
				textAlign(LEFT, TOP);
				textSize(cellSize * .125);
				text(value.subval.join(" "), 2, 2, cellSize - 4, cellSize - 4);
				pop();
			}
			pop();
		}
		pop();
	}
	if (selection.x != undefined || selection.y != undefined) {
		push();
		strokeWeight(3);
		translate((selection.x - 4) * cellSize, (selection.y - 4) * cellSize);
		stroke(theme.inputColor.primary);
		rect(0, 0, cellSize, cellSize);
		pop();
	}
}
