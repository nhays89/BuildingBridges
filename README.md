# BuildingBridges

ACM ICPC World Finals 2003 - Graph theory

![alt](https://github.com/nhays89/BuildingBridges/blob/master/buildingbridges.png)

The City Council of New Altonville plans to build a system of bridges connecting all of its downtown
buildings together so people can walk from one building to another without going outside. You must
write a program to help determine an optimal bridge configuration.</br>
New Altonville is laid out as a grid of squares. Each building occupies a connected set of one or
more squares. Two occupied squares whose corners touch are considered to be a single building and
do not need a bridge. Bridges may be built only on the grid lines that form the edges of the squares.
Each bridge must be built in a straight line and must connect exactly two buildings.</br>
For a given set of buildings, you must find the minimum number of bridges needed to connect all
the buildings. If this is impossible, find a solution that minimizes the number of disconnected groups of
buildings. Among possible solutions with the same number of bridges, choose the one that minimizes
the sum of the lengths of the bridges, measured in multiples of the grid size. Two bridges may cross,
but in this case they are considered to be on separate levels and do not provide a connection from one
bridge to the other.</br>
The figure below illustrates four possible city configurations. City 1 consists of five buildings that
can be connected by four bridges with a total length of 4. In City 2, no bridges are possible, since
no buildings share a common grid line. In City 3, no bridges are needed because there is only one
building. In City 4, the best solution uses a single bridge of length 1 to connect two buildings, leaving
two disconnected groups (one containing two buildings and one containing a single building).</br>

## Input
The input data set describes several rectangular cities. Each city description begins with a line containing
two integers r and c, representing the size of the city on the north-south and east-west axes
measured in grid lengths (1 ≤ r ≤ 100 and 1 ≤ c ≤ 100). These numbers are followed by exactly r lines,
each consisting of c hash (‘#’) and dot (‘.’) characters. Each character corresponds to one square of
the grid. A hash character corresponds to a square that is occupied by a building, and a dot character
corresponds to a square that is not occupied by a building.</br>
The input data for the last city will be followed by a line containing two zeros.</br>

## Output 
For each city description, print two or three lines of output as shown below. The first line consists of
the city number. If the city has fewer than two buildings, the second line is the sentence ‘No bridges
are needed.’. If the city has two or more buildings but none of them can be connected by bridges, the
second line is the sentence ‘No bridges are possible.’. Otherwise, the second line is ‘N bridges
of total length L’ where N is the number of bridges and L is the sum of the lengths of the bridges
of the best solution. (If N is 1, use the word ‘bridge’ rather than ‘bridges.’) If the solution leaves
two or more disconnected groups of buildings, print a third line containing the number of disconnected
groups.</br>
Print a blank line between cases. Use the output format shown in the example.</br>

## Sample Input
3 5</br>
#. . . #</br>
. . # . .</br>
#. . . #</br>
3 5</br>
##. . .</br>
. . . . .</br>
. . . . #</br>
3 5</br>
#. ###</br>
#. #. #</br>
###. #</br>
3 5</br>
#. # . .</br>
. . . . .</br>
. . . .#</br>
0 0</br>

## Sample Output
<samp>City 1</samp></br>
4 bridges of total length 4</br>
<samp>City 2</samp></br>
No bridges are possible.</br>
2 disconnected groups</br>
<samp>City 3</samp></br>
No bridges are needed.</br>
<samp>City 4</samp></br>
1 bridge of total length 1</br>
2 disconnected groups</br>

## Solution
1) parse input into a 2d array.<br>
2) generate nodes for each # and group adjacent nodes into buildings.<br>
3) store each of the nodes in a map object, where each property of the map 
   represents the index of each row in the grid. The row object will contain the index of each node in that row (the columns).  
   &nbsp;var map = {<br>
   &nbsp;"0": {<br>
   &nbsp;&nbsp;"3": { x: 0, y: 3, bldgNum: 0}<br>
   &nbsp;&nbsp;"7": { x :0, y: 7, bldgNum: 1}<br> 
   &nbsp;&nbsp;...<br>
   &nbsp;}, <br>
   &nbsp;"1": {<br>
   &nbsp;&nbsp;"2": {x: 1, y: 2, bldgNum: 2}<br>
   &nbsp;&nbsp;"3": {x: 1, y: 5, bldgNum: 2}<br>
   &nbsp;&nbsp;...<br>
   &nbsp;},<br>
   &nbsp;...<br>
   &nbsp;};<br>
4) create a list of building objects. <br>
   [{ bldgNum: 1, reachable: [] }, {bldgNum: 2, reachable: [], ...]<br>
   -each building object will contain a list of reachable buildings initially empty but soon to be populated.<br>
5) for each node, s, in the map calculate the distance from s to every other reachable node, d, and insert an object containing the       buildings of each node along with the distance between them into a min priority queue where s and d do no have the same building.     i.e {src: 1, dest: 2, distance: 10 }.<br>
   -this distance will serve as the bridge between the nodes of neighboring buildings.<br>
6) while there are bridges remaining in the queue and buildings not connected:<br>
&nbsp;a) remove an element from the queue,<br>
&nbsp;b) if the src building and dest building are not connected and connecting them will not create a cycle ?<br>
&nbsp;&nbsp;1) merge the src and dest reachable buildings together such that the src's reachable buildings will contain all the &nbsp;&nbsp;dest reachable buildings and vice versa (compute transitive closure). 
7) output the result in the format expected.<br>
