//Author: Nicholas A. Hays

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
        queue = new PriorityHeap();
        map = {};
        arr = [];
        if (rows == 0 && cols == 0)
            break;
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
            var str = data[index++];
            map[i] = {};
            for (var j = 0; j < cols; j++) {
                arr[i][j] = str[j];
            }
        }
        var numOfBldgs = genBldgs();
        var bldgs = [];
        for (i = 0; i < numOfBldgs; i++) {
            bldgs[i] = i;
        }
        search();
        buildBridges();
        output();
    }
}

//generate buildings 
function genBldgs() {
    var numOfBldgs = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (arr[i][j] == "#") {
                if (!map[i][j]) {
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
    if (map[row][col]) {
        return;
    }
    map[row][col] = { x: row, y: col, bldg: bldg };
    var nodes = getAdjNodes(row, col); 
    for (var n: nodes) {
        genBldg(n.x, n.y, bldg);
    }
}


//get adjacent nodes in bldg that are currently not in the map of nodes
function getAdjNodes(row, col) {
    var nodes = [];
    var el;
    //left: row, col -1
    if (col - 1 >= 0) {
        el = arr[row][col - 1];
        if (el == '#' && !map[row][col - 1]) {
            nodes.push({ x: row, y: col - 1 });
        }
    }

    //bottom left: row + 1, col -1
    if (row + 1 < rows && col - 1 >= 0) {
        el = arr[row + 1][col - 1];
        if (el == '#' && !map[row + 1][col - 1]) {
            nodes.push({ x: row + 1, y: col - 1 });
        }
    }

    //bottom row + 1, col
    if (row + 1 < rows) {
        el = arr[row + 1][col];
        if (el == '#' && !map[row + 1][col]) {
            nodes.push({ x: row + 1, y: col });
        }
    }

    //bottom right row + 1, col + 1
    if (row + 1 < rows && col + 1 < cols) {
        el = arr[row + 1][col + 1];
        if (el == '#' && !map[row + 1][col + 1]) {
            nodes.push({ x: row + 1, y: col + 1 });
        }
    }

    //right row, col + 1
    if (col + 1 < cols) {
        el = arr[row][col + 1];
        if (el == '#' && !map[row][col + 1]) {
            nodes.push({ x: row, y: col + 1 });
        }
    }

    //top right row -1, col + 1
    if (row - 1 >= 0 && col + 1 < cols) {
        el = arr[row - 1][col + 1];
        if (el == '#' && !map[row - 1][col + 1]) {
            nodes.push({ x: row - 1, y: col + 1 });
        }
    }

    //top row -1, col 
    if (row - 1 >= 0) {
        el = arr[row - 1][col];
        if (el == '#' && !map[row - 1][col]) {
            nodes.push({ x: row - 1, y: col });
        }
    }


    //top left row -1, col -1
    if (row - 1 >= 0 && col - 1 >= 0) {
        el = arr[row - 1][col - 1];
        if (el == '#' && !map[row - 1][col - 1]) {
            nodes.push({ x: row - 1, y: col - 1 });
        }
    }

    return nodes;

}

function search() {
    for (var row in map) {
        for (var col in row) {
            var node = map[row][col];
            var sx, sy, key;
            var bldg = node.bldg;
            var x = row;
            var y = col;

            //left top going left
            if (x - 1 >= 0 && y - 2 >= 0 && !map[x - 1][y - 1]) {
                sx = x - 1;
                sy = y - 2;
                while (sy >= 0) {
                    if (map[sx][sy]) {
                        if (map[sx][sy].bldg != bldg) {
                            queue.
                        } else {
                            break;
                        }
                    }
                    sy--;
                }
            }
            //left 
            x && y - 1 >= 0
                //left bottom
            x + 1 <= rows, y - 1 >= 0
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


function PriorityHeap() {

    var heap = [];
    this.h = heap;
    var lastInsert = 0;

    this.insert = function(child) {
        if (heap.length == 0) {
            heap.push(child);
            lastInsert++;
            return;
        }
        heap.push(child);
        lastInsert++;
        var curr = heap.length - 1;
        var parentIndex;
        while (curr > 0) {
            if (curr % 2 == 0) {
                parentIndex = Math.floor(curr / 2) - 1;
            } else {
                parentIndex = Math.floor(curr / 2);
            }

            if (heap[curr].dist < heap[parentIndex].dist) {
                swap(curr, parentIndex);
                curr = parentIndex;
            } else {
                break;
            }
        }
    }

    this.peek = function() {
        return heap[0];
    }

    this.poll = function() {
        if (heap.length == 0) {
            return;
        }
        swap(0, heap.length - 1);
        var el = heap.pop();
        var curr = 0;
        while (curr < heap.length - 1) {
            var left = curr * 2 + 1;
            var right = curr * 2 + 2;
            if (left >= heap.length) {
                break;
            } else if (right >= heap.length) { //then only left can be checked
                if (heap[curr].dist > heap[left].dist) {
                    swap(curr, left);
                }
                break;
            } else {
                var smaller = heap[left].dist < heap[right].dist ? left : right;
                if (heap[curr].dist > heap[smaller].dist) {
                    swap(curr, smaller);
                    curr = smaller;
                } else {
                    break;
                }
            }
        }
        lastInsert--;
        return el;
    }


    var swap = function(childIndex, parentIndex) {
        if (childIndex == parentIndex) {
            return;
        }
        var parent = heap[parentIndex];
        heap[parentIndex] = heap[childIndex];
        heap[childIndex] = parent;
    }
}




main("3 5\n#...#\n..#..\n#...#\n3 5\n##...\n.....\n....#\n3 5\n#.###\n#.#.#\n###.#\n3 5\n#.#..\n.....\n....#\n0 0");
