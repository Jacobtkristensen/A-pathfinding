"use strict";
import { GridGraph } from "./model/model.js";
import { GridSearchView } from "./view/view.js";

let searchState;
let distanceMetric = "taxicab"; // Default metric
let startcell;
let goalcell;
let graph = new GridGraph(40, 25, distanceMetric); 
const view = new GridSearchView(graph);
graph.view = view;
let obstacles=[];
window.addEventListener("load", load);

function load() {
    console.log("Ready.");
    setupEventListeners();
    initializeGraph();
}

function initializeGraph() {
    graph = new GridGraph(40, 25, distanceMetric); 
    graph.view = view;
    view.makeBoardClickable();
    console.log("Graph initialized.");
}

function start() {
    console.log(graph);
    const start = startcell;
    const goal = goalcell;

    if (!start || !goal) {
        console.error("Start or goal cell is not set.");
        return;
    }
let blockedcells=setobstaclesfromview();
console.log("blocked: ", blockedcells);
    graph.metric = distanceMetric;
   
    blockedcells.forEach(cell=>{
       
        const [row, col] = cell;
        graph.setObstacle(row,col)})
 
    graph.startAStar(start, goal);
    searchState = { done: false, path: [] };
    loop();
}
function setobstaclesfromview(){
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        if(cell.classList.contains("inaccessible")){
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            obstacles.push([row,col]);
           
        }
    });
 return obstacles;
}
function loop() {
    if (searchState.done) {
        console.log("Path found or no path exists.");
        if (searchState.path.length > 0) {
            view.visualizeFinalPath(searchState.path); // Highlight the final path in green
        }
        return;
    }

    searchState = graph.stepAStar();

    if (!searchState.done) {
        view.highlightNeighbors(searchState.current, searchState.neighbors); // Highlight neighbors in blue
        setTimeout(loop, 70); // Adjust the delay as needed for visualization speed
    } else {
        view.visualizeFinalPath(searchState.path); // Highlight the final path in green
        console.log("Final path: ", searchState.path);
    }
}

function setupEventListeners() {
    document.getElementById("start-btn").addEventListener("click", start);

    document.querySelector("#taxicab").addEventListener("change", function () {
        if (this.checked) {
            distanceMetric = "taxicab";
            graph.metric = distanceMetric;
            console.log("Distance Metric changed to:", distanceMetric);
            initializeGraph();
        }
    });

    document.querySelector("#chebyshev").addEventListener("change", function () {
        if (this.checked) {
            distanceMetric = "chebyshev";
            graph.metric = distanceMetric;
            console.log("Distance Metric changed to:", distanceMetric);
            initializeGraph();
        }
    });

    document.querySelector("#start-cell").addEventListener("change", function () {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.classList.remove("start"));
        startcell = document.querySelector("#start-cell").value;
        const [row, col] = startcell.split(',').map(Number);
        const visualStartCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        visualStartCell.classList.add("start");
        console.log("Start cell changed to:", startcell);
    });

    document.querySelector("#goal-cell").addEventListener("change", function () {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.classList.remove("goal"));
        goalcell = document.querySelector("#goal-cell").value;
        const [row, col] = goalcell.split(',').map(Number);
        const visualGoalCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        visualGoalCell.classList.add("goal");
        console.log("Goal cell changed to:", goalcell);
    });
}
