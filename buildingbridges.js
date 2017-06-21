

function main(input) {

var queue = [];

var map = {};

var arr = [];

var data = input.splice("\n");

var index = 0;

while (true) {

	var dims = data[index++].splice(" ");

	var rows = dims[0];

	var cols = dims[1];

	if(rows == 0 && cols == 0)
		 break;

	for ( var i = 0; i < rows; i++) {

		arr[0] = [];

		var str = data[index++];

		for(var j = 0; j < cols; j++) {

			arr[i][j] = str[j];

		}
	}

}

genBuildings(arr);
search();
buildBridges();

}


function genBuildings(arr) {

}


function search() {

}

function buildBridges() {

}



main("3 5\n#...#\n..#..\n#...#\n3 5\n##...\n.....\n....#\n3 5\n#.###\n#.#.#\n###.#\n3 5\n#.#..\n.....\n....#\n0 0");


