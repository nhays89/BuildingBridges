/*

Author: Nicholas A. Hays

2721 - Building Bridges 
ACM ICPC World Finals Beverly Hills

Determines the total number of bridges needed to connect a given set of buildings together over a 2d grid.
Each building is composed of one or more adjacent nodes. The nodes are stored in a map, accessible by their 
xy grid location. For each node in the map, distances are calculated between the node and its nearby neighboring nodes.
If the 2 nodes are not in the same building, then a bridge must be created to connect their buildings.
For each bridge that is created, an object is stored in a minimum priority queue that consists of the buildings
that connect that bridge, along with the length of the bridge. The queue is sorted by the length of the bridge.
Thus once all the calculations have been made, the queue is polled until all buildings have been connected. 
There may be instances where buildings cannot be connected because their nodes do not fall on the same grid lines.
In these cases there will be disconnected buildings indicated by the fact that a given building's list of reachable buildings
does not contain all the buildings when the queue is completely empty; therefore, we know that there are disjoint 
buildings (by transitive closure). 

*/

/*

Globals

*/
var rows, cols, map, queue, arr, blgs;

/*

Runner.
Parses input into a 2d array.
@input - the input string
i.e "3 5\n#...#\n..#..\n#...#\n0 0"
*/

function main(input) {
    var data = input.split("\n");
    var index = 0;
    var city = 0;
	queue = new PriorityHeap();
    while (true) {
        var dims = data[index++].split(" ");
        rows = dims[0];
        cols = dims[1];
        if (rows == 0 && cols == 0)
            break;
         // will be a min priority heap
        map = {}; // will contain a map of all nodes
        arr = []; // will hold input 
        bldgs = []; // will contain all nodes and the location for all buildings generated
        city++;
        queue.clear();
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
            var str = data[index++];
            map[i] = {};
            for (var j = 0; j < cols; j++) {
                arr[i][j] = str[j];
            }
        }
        genBldgs();
        search();
        var bridgeData = buildBridges();
        output(city, bridgeData);
    }
}

/*

Each building object contains its number along with a list of reachable 
buildings. Each new building adds itself to its list of reachable 
buildings. a -> a

*/
function genBldgs() {
    var numOfBldgs = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (arr[i][j] == "#") {
                if (!map[i][j]) {
                    var nodes = [];
                    genBldg(i, j, numOfBldgs, nodes);
                    var bldg = { bldg: numOfBldgs++, reachable: [] };
                    bldg.reachable.push(bldg);
                    bldgs.push(bldg);
                }
            }
        }
    }
}

/*

Recursively generates a building by adding all adjacent nodes to this building.
Then for each adjacent node, adds all of its adjacent nodes...etc.
example bldg:

..#.
..##
...#
..#.
.#..
###.

(0,2) - > [(1,2), (1,3)]
(1,2) - > [(2,3)]
(2,3) - > [(3,2)]
(3,2) - > [(4,1)]
(4,1) - > [(5,0), (5,1), (5,2)]
(5,0) - > []
(5,1) - > []
(5,2) - > []
(1,3) - > []

*/
function genBldg(row, col, bldg) {
    if (map[row][col]) {
        return;
    }
    map[row][col] = { x: row, y: col, bldg: bldg };
    var nodes = getAdjNodes(row, col, bldg);
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            genBldg(nodes[i].x, nodes[i].y, bldg);
        }
    }


}


/*

Helper to genBldg.
Get adjacent nodes for a given bldg if those nodes are not
already in the map of nodes.

*/
function getAdjNodes(row, col, bldg) {
    var el;
    //left: row, col -1
    var nodes = [];
    if (col - 1 >= 0) {
        el = arr[row][col - 1];
        if (el == '#' && !map[row][col - 1]) {
            nodes.push({ x: row, y: col - 1, bldg: bldg });
        }
    }

    //bottom left: row + 1, col -1
    if (row + 1 < rows && col - 1 >= 0) {
        el = arr[row + 1][col - 1];
        if (el == '#' && !map[row + 1][col - 1]) {
            nodes.push({ x: row + 1, y: col - 1, bldg: bldg });
        }
    }

    //bottom row + 1, col
    if (row + 1 < rows) {
        el = arr[row + 1][col];
        if (el == '#' && !map[row + 1][col]) {
            nodes.push({ x: row + 1, y: col, bldg: bldg });
        }
    }

    //bottom right row + 1, col + 1
    if (row + 1 < rows && col + 1 < cols) {
        el = arr[row + 1][col + 1];
        if (el == '#' && !map[row + 1][col + 1]) {
            nodes.push({ x: row + 1, y: col + 1, bldg: bldg });
        }
    }

    //right row, col + 1
    if (col + 1 < cols) {
        el = arr[row][col + 1];
        if (el == '#' && !map[row][col + 1]) {
            nodes.push({ x: row, y: col + 1, bldg: bldg });
        }
    }

    //top right row -1, col + 1
    if (row - 1 >= 0 && col + 1 < cols) {
        el = arr[row - 1][col + 1];
        if (el == '#' && !map[row - 1][col + 1]) {
            nodes.push({ x: row - 1, y: col + 1, bldg: bldg });
        }
    }

    //top row -1, col 
    if (row - 1 >= 0) {
        el = arr[row - 1][col];
        if (el == '#' && !map[row - 1][col]) {
            nodes.push({ x: row - 1, y: col, bldg: bldg });
        }
    }


    //top left row -1, col -1
    if (row - 1 >= 0 && col - 1 >= 0) {
        el = arr[row - 1][col - 1];
        if (el == '#' && !map[row - 1][col - 1]) {
            nodes.push({ x: row - 1, y: col - 1, bldg: bldg });
        }
    }
    return nodes;
}

/*

Searches for nearby neighbors.

Example. 
searching node location: S 
X's denote search coordinates.
If an X is a #, and that #'s bldg does not equal S's bldg.
Add a new object into the queue:
{
    src: S,
    dest: X,
    dist: S.coord - X.coord
}



                      ^ ^ ^
                      | | |   
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0
        < - X X X X X 0 0 0 X X X X X - >
        < - X X X X X 0 S 0 X X X X X - >
        < - X X X X X 0 0 0 X X X X X - >
            0 0 0 0 0 X X X 0 0 0 0 0 
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0
            0 0 0 0 0 X X X 0 0 0 0 0 
            0 0 0 0 0 X X X 0 0 0 0 0 
                      | | |
                      V V V

*/
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(y - dy) - 1 });
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
                        }
                        break;
                    }
                    dx--;
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
                        }
                        break;
                    }
                    dx--;
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
                            queue.insert({ src: node, dest: destNode, dist: Math.abs(x - dx) - 1 });
                        }
                        break;
                    }
                    dx--;
                }

            }

        }
    }
}

/*

Continues to connect buildings while there are elements remaining in the queue,
and buildings remain unreachable. Computes the transitive closure of each building after each new
connection is made.

ex: 
queue:

0 - > 1  1 
1 - > 0  1
2 - > 9  1
9 - > 2  1
7 - > 3  2
6 - > 5  2
3 - > 7  2
5 - > 6  2
...

bridges:
0 - > 1  1
2 - > 9  2
7 - > 3  2
...


*/
function buildBridges() {

    var bridge = queue.poll();
    var numOfBridges = 0;
    var bridgesLength = 0;

    while (bridge && isBridgeRemaining()) {
        var srcBldg = bldgs[bridge.src.bldg];
        var destBldg = bldgs[bridge.dest.bldg];
        var canBuild = true;
        if (!srcBldg.reachable.includes(destBldg)) {
            var srcBldgs = srcBldg.reachable;
            var destBldgs = destBldg.reachable;
            var srcLen = srcBldgs.length;
            var destLen = destBldgs.length;
            for( var i = 0 ; i < srcLen; i++ ) {
            	srcBldgs[i].reachable = srcBldgs[i].reachable.concat(destBldgs);
            }
           
            for(i = 0; i < destLen; i++) {
            	destBldgs[i].reachable = destBldgs[i].reachable.concat(srcBldgs);
            }
            numOfBridges++;
            bridgesLength += bridge.dist;

        }
            bridge = queue.poll();
    }
    return { numOfBridges: numOfBridges, len: bridgesLength };
}

/*

A Helper that tests to see if all buildings are connected.

*/
function isBridgeRemaining() {

    var bldg = bldgs[0];
    var numOfBldgs = bldgs.length;
    var isBridgeNeeded = true;
    if (numOfBldgs == 1) {
        isBridgeNeeded = false;
    } else {
        if (bldg.reachable.length == numOfBldgs) {
            isBridgeNeeded = false;
        }
    }
    return isBridgeNeeded;
}

/*

Display's formatted output to console of the total number of bridges,
sum of all the length's of bridges, and disconnected buildings (if any).

*/
function output(city, data) {
    console.log("City " + city);
    if (bldgs.length < 2) {
        console.log("No bridges are needed.");
    } else {
        if (data.numOfBridges > 0) {
            console.log(data.numOfBridges + " bridges of total length " + data.len);
        } else {
            console.log("No bridges are possible.");
        }

        if (data.numOfBridges < bldgs.length - 1) {
          
            var numOfDisc = Math.abs(bldgs.length - data.numOfBridges);
           
            console.log(numOfDisc + " disconnected groups");
        }
    }
    console.log("");
}

/*

A priority heap to store the bridges between buildings.

*/
function PriorityHeap() {

    var heap = [];
    this.h = heap;
    this.new = 0;
    var lastInsert = 0;
    /*
        Inserts a node into the heap.
    */
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

    /*
        Checks to see the first node.
    */

    this.peek = function() {
        return heap[0];
    }

    /*
        Removes and returns the first element of the heap.
    */

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
    /* 
        Clears the heap.
    */
    this.clear = function() {
        var len = heap.length;
        for (var i = 0; i < len; i++) {
            heap.pop();
        }
        lastInsert = 0;
    }

    /*
        Swaps nodes in the heap.
    */  
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
