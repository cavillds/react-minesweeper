
export function initTiles(rows, cols, mines) {
    let tiles = [];
    for(let i = 0; i < rows; i++) {
        let row = [];
        for(let j = 0; j < cols; j++) {
            const tile = {
                'row': i,
                'col': j,
                'isMine': false,
                'mines': 0,
                'status': 'closed'
            };
            row.push(tile);
        }
        tiles.push(row);
    }
    initMines(tiles, mines);
    return tiles;
}

function initMines(tiles, mines) {
    let remaining = mines;
    while(remaining > 0) {
        const row = Math.floor(Math.random() * tiles.length);
        const col = Math.floor(Math.random() * tiles[0].length);
        if(!tiles[row][col].isMine) {
            tiles[row][col].isMine = true;
            updateMineCount(tiles, row, col - 1);
            updateMineCount(tiles, row, col + 1);
            updateMineCount(tiles, row - 1, col);
            updateMineCount(tiles, row + 1, col);
            updateMineCount(tiles, row - 1, col - 1);
            updateMineCount(tiles, row - 1, col + 1);
            updateMineCount(tiles, row + 1, col - 1);
            updateMineCount(tiles, row + 1, col + 1);
            remaining--;
        }            
    }
}

function updateMineCount(tiles, row, col) {
    if(row >= 0 && row < tiles.length && col >= 0 && col < tiles[row].length) {
        tiles[row][col].mines += 1;
    }
}

export function revealNeighbors(tiles, row, col) {
    let neighbors = [];
    let openTiles = 0;
    neighbors.splice(-1, 0, [row + 1, col],[row - 1, col],[row, col + 1],[row, col - 1]);
    neighbors.splice(-1, 0, [row + 1, col + 1], [row + 1, col - 1], [row - 1, col + 1], [row - 1, col - 1]);
    while(neighbors.length > 0) {
        let neighbor = neighbors.shift();
        const nRow = neighbor[0];
        const nCol = neighbor[1];
        if(nRow >= 0 && nRow < tiles.length && nCol >= 0 && nCol < tiles[row].length) {
            const tile = tiles[nRow][nCol];
            if(tile.status === 'closed' && !tile.isMine) {
                tile.status = 'open';
                openTiles += 1;
                if(tile.mines === 0) {
                    neighbors.splice(-1, 0, [nRow + 1, nCol], [nRow - 1, nCol], [nRow, nCol + 1], [nRow, nCol - 1]);
                    neighbors.splice(-1, 0, [nRow + 1, nCol + 1], [nRow + 1, nCol - 1], [nRow - 1, nCol + 1], [nRow - 1, nCol - 1]);
                }
            }
        }
    }
    return openTiles;
  }

export function revealMines(tiles) {
    for(let row of tiles) {
        for(let tile of row) {
            if(tile.isMine && tile.status === 'closed') {
                tile.status = 'flagged';
            }
        }            
    }
}