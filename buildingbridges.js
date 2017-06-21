
//globals

var rows, cols, map, queue, arr;


//runner

function main(input) {


var data = input.splice("\n");

var index = 0;

var city = 0;

while (true) {

	var dims = data[index++].splice(" ");

	rows = dims[0];

	cols = dims[1];

	queue = [];
	map = {};
	arr = [];
	city++;
	if(rows == 0 && cols == 0)
		 break;

	for ( var i = 0; i < rows; i++) {

		arr[i] = [];

		var str = data[index++];

		map[i] = {};

		for(var j = 0; j < cols; j++) {

			arr[i][j] = str[j];

		}
	}

var numOfBldgs = genBldgs();
var bldgs = [];
for( var b = 0; b < bldgs; b++) {
	bldgs[b] = b;
}
search();
buildBridges();
output();

}


}

//generate buildings 

function genBldgs() {

var numOfBldgs = 0;

	for( var i = 0 ; i < rows; i++) {
		for ( var j = 0; j < cols; j++) {

			if(arr[i][j] == "#") {
				

				if( map[i][j]) {
					continue;
				} else {
					var bldg = genBldg(i, j, numOfBldgs);
					numOfBldgs++;
				}

			}

		}
	}
return numOfBldgs;

}


//generate building

function genBldg(row, col, bldg) {


	if(map[row][col]) {
		return;
	} 
	map[row][col] = {x: row, y: col, bldg: bldg};

	var nodes = getAdjNodes(row, col); //returns only nodes not in map

	for ( var n : nodes) {

		genBld(n.x, n.y, bldg);

	}
	


}

//get adjacent nodes in bldg

function getAdjNodes(row, col) {


	var stack = [];
	var el;
	//left row, col -1
	if( col - 1 >= 0) {
		el = arr[row][col -1];
		if(el == '#' && !map[row][col-1]) {
			stack.push({x: row, y: col - 1});
		}
	}

	//bottom left row + 1, col -1
	if(row + 1 <= rows && col -1 >= 0) {
		el = arr[row + 1][col -1];
		if(el == '#' && !map[row + 1][col -1]) {
			stack.push({x: row + 1, y: col - 1});
		}
	}

	//bottom row + 1, col
	if(row + 1 <= rows) {
		el = arr[row + 1][col];
		if(el == '#' && !map[row + 1][col]) {
			stack.push({x: row + 1, y: col});
		}
	}

	//bottom right row + 1, col + 1
	if(row + 1 <= rows && col + 1 <= cols) {
		el = arr[row + 1][col  + 1];
		if(el == '#' && !map[row + 1][col + 1]) {
			stack.push({x: row + 1, y: col + 1});
		}
	}

	//right row, col + 1
	if(col + 1 <= cols) {
		el = arr[row][col  + 1];
		if(el == '#' && !map[row][col + 1]) {
			stack.push({x: row, y: col + 1});
		}
	}

	//top right row -1, col + 1
	if(row - 1 >= 0 && col + 1 <= cols) {
		el = arr[row - 1][col + 1];
		if(el == '#' && !map[row - 1][col + 1]) {
			stack.push({x: row - 1, y: col + 1});
		}
	}

	//top row -1, col 
	if(row - 1 >= 0) {
		el = arr[row - 1][col];
		if(el == '#' && !map[row - 1][col]) {
			stack.push({x: row - 1, y: col});
		}
	}


	//top left row -1, col -1
	if(row - 1 >= 0 && col -1 >= 0) {
		el = arr[row - 1][col - 1];
		if(el == '#' && !map[row - 1][col -1 ]) {
			stack.push({x: row - 1, y: col -1});
		}
	}

	return stack;

}

function search() {


for(var row in map) {
	for(var col in row) {
		var node = map[row][col];
		var sx, sy, key;
		var bldg = node.bldg;
		var x = row;
		var y = col;
	
		//left top going left
		if(x -1 >= 0 && y -2 >= 0) {
			if(!map[x-1][y-1]) { //same bldg but closer to next bldg from this position
				sx = x -1;
				sy = y -2;
				while(sy >= 0) {
					
					if(map[sx][sy]) {
						if(ma[sx][sy].bldg != bldg) {
							queue.
						}
					}
					sy--;
				}
			}
			
		}
		//left 
		x && y-1 >= 0
		//left bottom
		x + 1 <= rows, y -1 >= 0
		//bottom left
		x + 1 <= rows, y - 1 >= 0
		//bottom
		y && x + 1 <= rows
		//bottom right
		y + 1 <= cols && x + 1 <= rows
		//right bottom
		//right
		//right top
		//top right
		//top 
		//top left


	}
}

	


}



}

function buildBridges() {

}


function PriorityQueue(comparator) {

	//array

	//


}



main("3 5\n#...#\n..#..\n#...#\n3 5\n##...\n.....\n....#\n3 5\n#.###\n#.#.#\n###.#\n3 5\n#.#..\n.....\n....#\n0 0");


