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
    constructor(width, height,metric="taxicab", view) {
        this.width = width;
        this.height = height;
        this.nodes = new Map();
        this.metric=metric;
        this.view = view;

        this.createGrid();
        this.createEdges();
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
            if (this.nodes.get(node1).accessible && this.nodes.get(node2).accessible) {
                this.nodes.get(node1).neighbors.push(node2);
                this.nodes.get(node2).neighbors.push(node1); // For undirected graph
            }

        }else{
            console.log(`Attempted to add edge between non-existent nodes: ${node1} - ${node2}`)
        }
    }

    addEdgesForNode(x, y) {
       
        let neighbors=[];
        console.log("addEdges, metric: ",this.metric)
        const taxicabNeighbors = [
            [x - 1, y], // left
            [x + 1, y], // right
            [x, y - 1], // up
            [x, y + 1]  // down
        ];
        const chebyshevNeighbors=[
            [x - 1, y], // left
            [x + 1, y], // right
            [x, y - 1], // up
            [x, y + 1],  // down
            [x - 1,y - 1], //up left
            [x - 1,y + 1], //down left
            [x + 1,y - 1], //up right
            [x + 1,y + 1]  //down right
        ];
        if(this.metric==='taxicab'){
            neighbors=taxicabNeighbors;
        }else if(this.metric==='chebyshev'){
            neighbors=chebyshevNeighbors;
        }else{
            throw new Error("unknown metric");
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
      
        const [x1, y1] = node.split(',').map(Number);
        const [x2, y2] = goal.split(',').map(Number);
     
        if(this.metric==="taxicab"){
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
        else if(this.metric==="chebyshev"){
            return Math.max(Math.abs(x1-x2),Math.abs(y1-y2));
        }else{
            throw new Error("unknown metric");
        }
       
    }

     aStar(start, goal) {
        
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
            
            const neighbors = this.getNeighbors(current);
            
               this.view.highlightNeighbors(current, neighbors);
            
           

            for (let neighbor of this.getNeighbors(current)) { 
           
            console.log("current node: ",current);
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
        this.view.visualizePath(totalPath);
        return totalPath;
    }
    //STEP-BASED A* ALGORITHM
    startAStar(start, goal) {
        this.openSet = new PriorityQueue();
        this.openSet.enqueue(start, 0); // Use correct priority
        this.cameFrom = new Map();
    
        this.gScore = new Map();
        this.fScore = new Map();
    
        // Initialize gScore and fScore for all nodes
        this.nodes.forEach((_, node) => {
            this.gScore.set(node, Infinity);
            this.fScore.set(node, Infinity);
        });
    
        this.gScore.set(start, 0);
        this.fScore.set(start, this.heuristic(start, goal));
    
        this.current = null;
        this.goal = goal;
    }

    stepAStar() {
        if (this.openSet.isEmpty()) {
            return { done: true, path: [] }; // No path found
        }
    
        this.current = this.openSet.dequeue();
    
        if (this.current === this.goal) {
            const path = this.reconstructPath(this.cameFrom, this.current);
            return { done: true, path };
        }
    
        const neighbors = this.getNeighbors(this.current);
    
        for (let neighbor of neighbors) {
            let tentative_gScore = this.gScore.get(this.current) + 1; // Equal weights
    
            if (tentative_gScore < this.gScore.get(neighbor)) {
                this.cameFrom.set(neighbor, this.current);
                this.gScore.set(neighbor, tentative_gScore);
                this.fScore.set(neighbor, tentative_gScore + this.heuristic(neighbor, this.goal));
    
                if (!this.openSet.contains(neighbor)) {
                    this.openSet.enqueue(neighbor, this.fScore.get(neighbor)); // Use correct priority
                }
            }
        }
    
        return { done: false, current: this.current, neighbors };
    }
    
}


