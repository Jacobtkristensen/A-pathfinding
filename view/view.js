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
    // ### skal omskrives så den opdaterer celler/nodes tilføjes queue eller er del af path ###

    // updateView() {
    //     const cells = this.boardElement.querySelectorAll('.cell');
    //     cells.forEach(cell => {
    //         const row = parseInt(cell.dataset.row);
    //         const col = parseInt(cell.dataset.col);
    //         const cellState = this.model.getCell(row, col);
    //         if (cellState) {
    //             cell.classList.add('alive');
    //         } else {
    //             cell.classList.remove('alive');
    //         }
    //     });
        
    //     generations.value=`Generations: ${this.model.generations}`;
    // }
    makeBoardClickable(){
        this.boardElement.addEventListener("click", this.boardClicked.bind(this));
    }
    
    boardClicked(event){
        if(event.target.classList.contains("cell")){
            const cell = event.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            this.model.setObstacle(row, col);
            cell.classList.add("inaccessible");
            //this.updateView();
        }
    }
    
    highlightNeighbors(current, neighbors) {
        this.clearHighlights();
        neighbors.forEach(neighbor => {
            const [row, col] = neighbor.split(',').map(Number);
            const cell = this.boardElement.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (cell) {
                cell.classList.add('neighbor');
            }
        });
    }

    clearHighlights() {
        const cells = this.boardElement.querySelectorAll('.cell.neighbor');
        cells.forEach(cell => {
            cell.classList.remove('neighbor');
        });
    }
}