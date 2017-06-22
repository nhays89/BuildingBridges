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
                    genBldg(i, j, numOfBldgs);
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
    nodes.forEach(function(o) {
        genBldg(o.x, o.y, bldg);
    });

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
    for (var r in map) {
        var row = map[r];
        for (var c in row) {
            var node = row[c];
            var dx, dy, key;
            var bldg = node.bldg;
            var x = node.x;
            var y = node.y;

            //left top going left
            if (x - 1 >= 0 && y - 2 >= 0 && !map[x - 1][y - 1]) {
                dx = x - 1;
                dy = y - 2;
                while (dy >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy--;
                }
            }
            //left going left
            if (y - 2 >= 0 && !map[x][y - 1]) {
                dx = x;
                dy = y - 2;
                while (dy >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy--;
                }
            }

            //left bottom going left
            if (x + 1 < rows && y - 2 >= 0 && !map[x + 1][y - 1]) {
                dx = x + 1;
                dy = y - 2;
                while (dy >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy--;
                }

            }

            //bottom left going down
            if (x + 2 < rows && y - 1 >= 0 && !map[x + 1][y - 1]) {
                dx = x + 2;
                dy = y - 1;
                while (dx < rows) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx++;
                }
            }
            //bottom going down
            if (x + 2 < rows && !map[x + 1][y]) {
                dx = x + 2;
                dy = y;
                while (dx < rows) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx++;
                }

            }

            //bottom right going down
            if (y + 1 < cols && x + 2 < rows && !map[x + 1][y + 1]) {
                dx = x + 2;
                dy = y + 1;
                while (dx < rows) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx++;
                }
            }

            //right bottom going right
            if (x + 1 < rows && y + 2 < cols && !map[x + 1][y + 1]) {
                dx = x + 1;
                dy = y + 2;
                while (dy < cols) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy++;
                }
            }

            //right going right
            if (y + 2 < cols && !map[x][y + 1]) {
                dx = x;
                dy = y + 2;
                while (dy < cols) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy++;
                }
            }

            //right top going right
            if (x - 1 >= 0 && y + 2 < cols && !map[x - 1][y + 1]) {
                dx = x - 1;
                dy = y + 2;
                while (dy < cols) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.y - destNode.y) - 1 });
                        }
                        break;
                    }
                    dy++;
                }

            }
            //top right going up
            if (x - 2 >= 0 && y + 1 < cols && !map[x - 1][y + 1]) {
                dx = x - 2;
                dy = y + 1;
                while (dx >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx--;;
                }

            }
            //top going up
            if (x - 2 >= 0 && !map[x - 1][y]) {
                dx = x - 2;
                dy = y;
                while (dx >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx--;;
                }

            }

            //top left going up
            if (x - 2 >= 0 && y - 1 >= 0 && !map[x - 1][y - 1]) {
                dx = x - 2;
                dy = y - 1;
                while (dx >= 0) {
                    if (map[dx][dy]) {
                        if (map[dx][dy].bldg != bldg) {
                            var destNode = map[dx][dy];
                            queue.insert({ src: node.bldg, dest: destNode.bldg, dist: Math.abs(node.x - destNode.x) - 1 });
                        }
                        break;
                    }
                    dx--;;
                }

            }

        }
    }
}


function buildBridges() {

}


function PriorityHeap() {

    var heap = [];
    this.h = heap;
    this.new = 0;
    var lastInsert = 0;

    this.insert = function(child) {
        if (heap.length == 0) {
            heap.push(child);
            lastInsert++;
            return;
        } else if (heap.length == 1) {
            heap.push(child);
            lastInsert++;
            if (heap[1].dist < heap[0].dist) {
                swap(0, 1);
                return;
            }
        } else {
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

    this.clear = function() {
        var len = heap.length;
        for (var i = 0; i < len; i++) {
            heap.pop();
        }
        lastInsert = 0;
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
