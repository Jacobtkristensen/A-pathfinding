"use strict"
window.addEventListener("load", start);
function start() {
    console.log("Ready.");
}
/**
 * in this we will have the code to run the overall controls and functions to take input and render output
 * the model will be a sort of tree to keep track of the paths and a function to calculate the the total cost 
 * all nodes will placed on a level 2D grid (no gravity cost of movement) and the cost can solely be derived from coordinates
 * from start_node to the next_node +cost of going to the goal_node from that node. Each node will be kept in a queue sorted by cost.
 * 
 * functions: loop(): main iteration, calls the functions that wil calculate and update the tree of paths, update the visuals
 * displaySearchedPaths(): updates the visual of the searched paths, colored by weight in intervals as the total cost approaches the estimated cost
 * setupEventlisteners(): sets up eventlisteners for taking userinput such as: 
 * - chooseDistancemetric (taxicab or chebysev) they will simultanously detrmine allowed moves and become part of the heuristic,
 * - alterGrid( that allows user make some grids unvisitable), 
 *  - and maybe also an eventlistener that allows the user to fine tune the heuristic method 
 * 
 * notes: taxicab-dist=sqrt(2)*Euclid-dist (x2-x1+y2-y1), eucliddist=sqrt((x2-x1)^2+(y2-y1)^2), Chebyshev dist=max(x2-x1, y2-y1)
 * 
 */