// class Graph {
//     constructor() {
//         this.nodes = new Map();
//     }

//     addNode(node) {
//         this.nodes.set(node, []);
//     }
//  // in our grid we can assume equal weight for all
//     addEdge(node1, node2, weight) {
//         this.nodes.get(node1).push({ node: node2, weight: weight });
//         this.nodes.get(node2).push({ node: node1, weight: weight }); // For undirected graph
//     }

//     getNeighbors(node) {
//         return this.nodes.get(node);
//     }

//     heuristic(node, goal) {
//         // Implement your heuristic function here.
//         // For example, if nodes have x and y coordinates, you could use the Euclidean distance:
//         // return Math.sqrt((node.x - goal.x) ** 2 + (node.y - goal.y) ** 2);
//         return 0; // Placeholder for heuristic value
//     }

//     aStar(start, goal) {
//         let openSet = new Set([start]);
//         let cameFrom = new Map();

//         let gScore = new Map();
//         let fScore = new Map();

//         this.nodes.forEach((_, node) => {
//             gScore.set(node, Infinity);
//             fScore.set(node, Infinity);
//         });

//         gScore.set(start, 0);
//         fScore.set(start, this.heuristic(start, goal));

//         while (openSet.size > 0) {
//             let current = [...openSet].reduce((acc, node) => {
//                 if (fScore.get(node) < fScore.get(acc)) {
//                     return node;
//                 }
//                 return acc;
//             });

//             if (current === goal) {
//                 return this.reconstructPath(cameFrom, current);
//             }

//             openSet.delete(current);

//             for (let { node: neighbor, weight } of this.getNeighbors(current)) {
//                 let tentative_gScore = gScore.get(current) + weight;

//                 if (tentative_gScore < gScore.get(neighbor)) {
//                     cameFrom.set(neighbor, current);
//                     gScore.set(neighbor, tentative_gScore);
//                     fScore.set(neighbor, tentative_gScore + this.heuristic(neighbor, goal));

//                     if (!openSet.has(neighbor)) {
//                         openSet.add(neighbor);
//                     }
//                 }
//             }
//         }

//         return []; // Return an empty array if there is no path
//     }

//     reconstructPath(cameFrom, current) {
//         let totalPath = [current];
//         while (cameFrom.has(current)) {
//             current = cameFrom.get(current);
//             totalPath.unshift(current);
//         }
//         return totalPath;
//     }
// }
 class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    contains(element) {
        return this.elements.some(e => e.element === element);
    }
}


export class GridGraph {
    constructor(width, height,metric) {
        this.width = width;
        this.height = height;
        this.nodes = new Map();
        this.metric=metric;

        this.createGrid();
        this.createEdges(metric);
    }
    getWidth(){
        return this.width;
    }
    getHeight(){
        return this.height;
    }
    createGrid() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const node = `${x},${y}`;
                this.addNode(node);
                // this.addEdgesForNode(x, y);
            }
        }
    }
    createEdges(){
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // const node = `${x},${y}`;
                this.addEdgesForNode(x, y);
            }
        }
    }
    addNode(node) {
        if(!this.nodes.has(node)){
            this.nodes.set(node, {neighbors:[], accessible: true});
        }
        
    }
    setObstacle(x,y){
        const node = `${x},${y}`;
        if(this.nodes.has(node)){
            this.nodes.get(node).accessible=false;
        }
    }

    addEdge(node1, node2) {
        if(this.nodes.has(node1) && this.nodes.has(node2)){
            this.nodes.get(node1).neighbors.push(node2);
            this.nodes.get(node2).neighbors.push(node1); // For undirected graph

        }else{
            console.log(`Attempted to add edge between non-existent nodes: ${node1} - ${node2}`)
        }
    }

    addEdgesForNode(x, y) {
        if(!this.metric){
            this.metric='taxicab';
        }
        let neighbors=[]
        
        const taxicabNeighbors = [
            [x - 1, y], // left
            [x + 1, y], // right
            [x, y - 1], // up
            [x, y + 1]  // down
        ];
        const chebysevNeighbors=[
            [x - 1, y], // left
            [x + 1, y], // right
            [x, y - 1], // up
            [x, y + 1],  // down
            [x-1,y-1], //up left
            [x-1,y+1], //down left
            [x+1,y-1], //up right
            [x+1,y+1]  //down right
        ];
        if(this.metric==='taxicab'){
            neighbors=taxicabNeighbors;
        }else{
            neighbors=chebysevNeighbors;
        }
            
      
        for (let [nx, ny] of neighbors) {
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                const neighborNode = `${nx},${ny}`;
                const currentNode = `${x},${y}`;
                this.addEdge(currentNode, neighborNode);
            }
        }
    }

    getNeighbors(node) {
        return this.nodes.get(node).neighbors.filter(neighbor => this.nodes.get(neighbor).accessible);
    }

    heuristic(node, goal) {
        if(!this.metric){
            this.metric='taxicab';
        }
        const [x1, y1] = node.split(',').map(Number);
        const [x2, y2] = goal.split(',').map(Number);
        const taxicabdist=Math.abs(x1 - x2) + Math.abs(y1 - y2);
        const chebysevdist=Math.max(Math.abs(x1-x2),Math.abs(y1-y2));
        
        if(this.metric==="taxicab"){
            return taxicabdist;
        }
        else if(this.metric==="chebysev"){
            return chebysevdist;
        }
    }

    aStar(start, goal) {
        // if(!this.metric){
        //     this.metric='taxicab';
        // }
        let openSet = new PriorityQueue()
        openSet.enqueue(start, 0);
        let cameFrom = new Map();

        let gScore = new Map();
        let fScore = new Map();

        // Initialize gScore and fScore for all nodes
        this.nodes.forEach((_, node) => {
            gScore.set(node, Infinity);
            fScore.set(node, Infinity);
        });

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (!openSet.isEmpty()) {
            let current = openSet.dequeue(); 

            if (current === goal) {
                return this.reconstructPath(cameFrom, current);
            }
            

            for (let neighbor of this.getNeighbors(current)) { // TODO: visualize neighbors
                let tentative_gScore = gScore.get(current) + 1; // Equal weights

                if (tentative_gScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentative_gScore);
                    fScore.set(neighbor, tentative_gScore + this.heuristic(neighbor, goal));

                    if (!openSet.contains(neighbor)) {
                        openSet.enqueue(neighbor);
                    }
                }
            }
        }

        return []; // Return an empty array if there is no path
    }

    reconstructPath(cameFrom, current) {
        let totalPath = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath.unshift(current);
        }
        return totalPath;
    }
}

// Example usage:


// export class GridGraph {
//     constructor(width, height) {
//         this.width = width;
//         this.height = height;
//         this.nodes = new Map();

//         this.createGrid();
//         this.createEdges();
//     }

//     createGrid() {
//         let node='';
//         for (let y = 0; y < this.height; y++) {
//             for (let x = 0; x < this.width; x++) {
//                 const node = `${x},${y}`;
//                 this.addNode(node);
//                 // this.addEdgesForNode(x,y);
//             }
//         }
//     }
// createEdges(){
//     for (let y = 0; y < this.height; y++) {
//         for (let x = 0; x < this.width; x++) {
//             // const node = `${x},${y}`;
//             this.addEdgesForNode(x, y);
//         }
//     }
// }
//     addNode(node) {
//         if (!this.nodes.has(node)) {
//             this.nodes.set(node, []);
            
//         }
//     }

//     addEdge(node1, node2) {
//         if (this.nodes.has(node1) && this.nodes.has(node2)) {
//             this.nodes.get(node1).push(node2);
//             this.nodes.get(node2).push(node1); // For undirected graph
//         } else {
//             console.error(`Attempted to add edge between non-existent nodes: ${node1} - ${node2}`);
//         }
//     }

//     addEdgesForNode(x,y) {
//         const neighbors = [
//             [x - 1, y], // left
//             [x + 1, y], // right
//             [x, y - 1], // up
//             [x, y + 1]  // down
//         ];

//         for (let [nx, ny] of neighbors) {
//             if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
//                 const neighborNode = `${nx},${ny}`;
//                 const currentNode = `${x},${y}`;
//                 this.addEdge(currentNode, neighborNode);
//             }
//         }
//     }

//     getNeighbors(node) {
//         return this.nodes.get(node) || [];
//     }

//     heuristic(node, goal) {
//         const [x1, y1] = node.split(',').map(Number);
//         const [x2, y2] = goal.split(',').map(Number);
//         return Math.abs(x1 - x2) + Math.abs(y1 - y2); // Manhattan distance
//     }

//     aStar(start, goal) {
//         let openSet = new PriorityQueue();
//         openSet.enqueue(start, 0);
//         let cameFrom = new Map();

//         let gScore = new Map();
//         let fScore = new Map();

//         this.nodes.forEach((_, node) => {
//             gScore.set(node, Infinity);
//             fScore.set(node, Infinity);
//         });

//         gScore.set(start, 0);
//         fScore.set(start, this.heuristic(start, goal));

//         while (!openSet.isEmpty()) {
//             let current = openSet.dequeue();

//             if (current === goal) {
//                 return this.reconstructPath(cameFrom, current);
//             }

//             for (let neighbor of this.getNeighbors(current)) {
//                 let tentative_gScore = gScore.get(current) + 1; // Equal weights

//                 if (tentative_gScore < gScore.get(neighbor)) {
//                     cameFrom.set(neighbor, current);
//                     gScore.set(neighbor, tentative_gScore);
//                     fScore.set(neighbor, tentative_gScore + this.heuristic(neighbor, goal));

//                     if (!openSet.contains(neighbor)) {
//                         openSet.enqueue(neighbor, fScore.get(neighbor));
//                     }
//                 }
//             }
//         }

//         return []; // Return an empty array if there is no path
//     }

//     reconstructPath(cameFrom, current) {
//         let totalPath = [current];
//         while (cameFrom.has(current)) {
//             current = cameFrom.get(current);
//             totalPath.unshift(current);
//         }
//         return totalPath;
//     }
// }

// class PriorityQueue {
//     constructor() {
//         this.elements = [];
//     }

//     isEmpty() {
//         return this.elements.length === 0;
//     }

//     enqueue(element, priority) {
//         this.elements.push({ element, priority });
//         this.elements.sort((a, b) => a.priority - b.priority);
//     }

//     dequeue() {
//         return this.elements.shift().element;
//     }

//     contains(element) {
//         return this.elements.some(e => e.element === element);
//     }
// }

// // Example usage:
// const graph = new GridGraph(4, 4);
// const start = '0,0';
// const goal = '3,3';

// const path = graph.aStar(start, goal);
// console.log(path); // Output: Path from '0,0' to '3,3'
