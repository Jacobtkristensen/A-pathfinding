export class GridSearchView {
    constructor(model) {
        this.model = model;
        this.boardElement = document.querySelector('#grid');
        this.createBoard();
    }

    createBoard() {
        // Clear any existing board
        const WIDTH = this.model.getWidth();
        const HEIGHT = this.model.getHeight();
    
        // Clear any existing board
        this.boardElement.innerHTML = '';
    
        // Set the CSS grid properties
        this.boardElement.style.display = 'grid';
        this.boardElement.style.gridTemplateColumns = `repeat(${WIDTH}, 0.5fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${HEIGHT}, 0.5fr)`;
    
        // Create the grid dynamically
        for (let row = 0; row < HEIGHT; row++) {
            for (let col = 0; col < WIDTH; col++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                this.boardElement.appendChild(cellElement);
            }
        }
    }

    makeBoardClickable(){
        this.boardElement.addEventListener("click", this.boardClicked.bind(this));
    }
    
    boardClicked(event){
        if(event.target.classList.contains("cell")){
            const cell = event.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
           
            cell.classList.add("inaccessible");
           
        }
    }
    
    highlightNeighbors(current, neighbors) {
        // this.clearHighlights();
        neighbors.forEach(neighbor => {
            const [row, col] = neighbor.split(',').map(Number);
            const cell = this.boardElement.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (cell && !cell.classList.contains('start') && !cell.classList.contains('goal') &&!cell.classList.contains("inaccessible")) {
                cell.classList.add('neighbor');
            }
        });
    }

    clearHighlights() {
        const cells = this.boardElement.querySelectorAll('.cell.neighbor');
        cells.forEach(cell => {
            // cell.classList.remove('neighbor');
            cell.classList.add('visited');
        });
    }
    visualizePath(path){
        path.forEach(step=>{
            const [row, col] = step.split(',').map(Number);
            const cell = this.boardElement.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if(cell && !cell.classList.contains('start') && !cell.classList.contains('goal') &&!cell.classList.contains("inaccessible")){
                cell.classList.add('path');
            }
        
        })
    }
    visualizeFinalPath(path) {
        path.forEach(step => {
            const [row, col] = step.split(',').map(Number);
            const cell = this.boardElement.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (cell && !cell.classList.contains('start') && !cell.classList.contains('goal') &&!cell.classList.contains("inaccessible")) {
                cell.classList.add('final-path');
            }
        });
    }
    
    
  
}