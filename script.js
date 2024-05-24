"use strict"
import { GridGraph } from "./model/model.js";
import { GridSearchView } from "./view/view.js";

let distanceMetric;
let startcell;
let goalcell;
let graph= new GridGraph(40,25,distanceMetric); 
const view = new GridSearchView(graph);
graph.view = view;


window.addEventListener("load", load);
function load() {
    console.log("Ready.");
    graph= new GridGraph(40,25,distanceMetric); 
    const view = new GridSearchView(graph);
    graph.view = view;
    
    view.makeBoardClickable();
    setupEventlisteners();
    
    console.log("Graph initialized.");

    //console.log(graph)
    //const path=graph.aStar(start,goal);
    //console.log("path: ",path);
    // setup eventlisteners
   // setupEventlisteners();
    // setup the grid
   // setupGrid();
  //  loop()
}

function start(){
    console.log(graph)
    const start = startcell;
    const goal = goalcell;

    if (!start || !goal) {
        console.error("Start or goal cell is not set.");
        return;
    }

    const path = graph.aStar(start, goal);
    console.log("Path: ", path);


    // // start the search
    // graph.aStar(start,goal);

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
function loop(){ // just a placeholder for now
    if(currentcell===goalcell){
        console.log("Found the goal")
        return
    }
    setTimeout(loop(),500)
    // get next searchlayer
    // update visuals
    // update the tree
}
function setupEventlisteners(){

    document.getElementById("start-btn").addEventListener("click", start);

    document.querySelector("#taxicab").addEventListener("change", function(){
        if (this.checked) {
            distanceMetric = "taxicab";
            graph.metric=distanceMetric
            console.log("Distance Metric changed to:", distanceMetric);
        }
    });
    
    document.querySelector("#chebyshev").addEventListener("change", function(){
        if (this.checked) {
            distanceMetric = "chebyshev";
            graph.metric=distanceMetric
            console.log("Distance Metric changed to:", distanceMetric);
        }
    });
    // document.getElementById("alterGrid").addEventListener("click", function(){
    //     alterGrid();
    // });
    document.querySelector("#start-cell").addEventListener("change", function() {
       const cells=document.querySelectorAll(".cell");
        cells.forEach(cell=>cell.classList.remove("start"));
        startcell = document.querySelector("#start-cell").value;
        const [row, col] =startcell.split(',').map(Number);
        const visualstartcell=document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        visualstartcell.classList.add("start");
        console.log("Start cell changed to:", startcell);
    });

    document.querySelector("#goal-cell").addEventListener("change", function() {
       const cells=document.querySelectorAll(".cell");
        cells.forEach(cell=>cell.classList.remove("goal"));
        goalcell = document.querySelector("#goal-cell").value;
        const [row, col] =goalcell.split(',').map(Number);
        const visualgoalcell=document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        visualgoalcell.classList.add("goal");
        console.log("Goal cell changed to:", goalcell);
    });
    

}
function setObstacles(cell){
    // set the cell to be an obstacle by calling the setObstacle(x,y) method of the model. I guess the cell will need to have x & y values added or derived from grid....
    // add class obstacle to style the obstacle cell different than rest fx black or outset in a darkgray or something...
}
