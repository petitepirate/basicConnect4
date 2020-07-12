/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7; //used let due to the note of adding dynamics later
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2  // will have to switch between one and two
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	//i know there's nuances here im missing.
	for (let y = 0; y < HEIGHT; y++) {
		// iterate through the array once each row
		board.push(Array.from({ length: WIDTH })); // add 7 key values
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const htmlBoard = document.getElementById('board'); // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

	// TODO: add comment for this code
	const top = document.createElement('tr'); // creates variable / element table row, which is the top row
	top.setAttribute('id', 'column-top'); // sets the attribute id to column top so it can be selected later
	top.addEventListener('click', handleClick); // adds an event listener for a click so we can add a piece.

	for (let x = 0; x < WIDTH; x++) {
		//this block creates the clickable top row
		//iterates over the width of the board
		let headCell = document.createElement('td'); // creates variable with table data
		headCell.setAttribute('id', x); //sets the attribe id to x for selection
		top.append(headCell); //appends the new cell to the top row
	}
	htmlBoard.append(top); //appends the top to the overall html board

	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr'); //iterates for the height variable creating rows
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td'); // populates those rows with cells for the width of the board
			cell.setAttribute('id', `${y}-${x}`); //creates unique ides for each table cell
			row.append(cell); //appends the cells to the row
		}
		htmlBoard.append(row); //appends the rows to the board
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	//wasnt able to write on my own - taken from solutions
	for (let y = HEIGHT - 1; y >= 0; y--) {
		//decrements through a column
		if (!board[y][x]) {
			// checks if there is a space
			return y; //returns space if there is
		}
	}
	return null; //returns null if not
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);
	//piece.style.top = -50 * (y + 2); //unsure of what this is doing from the solutions page

	const spot = document.getElementById(`${y}-${x}`);
	spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
	//wrapped endgame function in a setTimeout so that we could see the final move before the alert
	setTimeout(function() {
		alert(msg);
	}, 200);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (
		board.every(function(row) {
			return row.every(function(cell) {
				return cell;
			});
		})
	) {
		return endGame('Tie!');
	}
	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
