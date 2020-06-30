import React from 'react';
import { Button, Flex, Grid, Text, EmojiIcon } from '@fluentui/react-northstar';
import Tile from '../Tile/Tile';
import Timer from '../Timer/Timer';
import './GameGrid.css';

class GameGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'status': 'created',
            'tiles': [],
            'openTiles': 0,
            'flags': 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleFlag = this.handleFlag.bind(this);
        this.revealNeighbors = this.revealNeighbors.bind(this);
        this.revealMines = this.revealMines.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    static initState(props) {
        let tiles = [];
        for(let i = 0; i < props.rows; i++) {
            let row = [];
            for(let j = 0; j < props.cols; j++) {
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
        GameGrid.initMines(props, tiles);
        return {
            'status': 'created',
            'tiles': tiles,
            'openTiles': 0,
            'flags': 0
        };
    }

    static initMines(props, tiles) {
        let remaining = props.mines;
        while(remaining > 0) {
            const row = Math.floor(Math.random() * tiles.length);
            const col = Math.floor(Math.random() * tiles[0].length);
            if(!tiles[row][col].isMine) {
                tiles[row][col].isMine = true;
                GameGrid.updateMineCount(tiles, row, col - 1);
                GameGrid.updateMineCount(tiles, row, col + 1);
                GameGrid.updateMineCount(tiles, row - 1, col);
                GameGrid.updateMineCount(tiles, row + 1, col);
                GameGrid.updateMineCount(tiles, row - 1, col - 1);
                GameGrid.updateMineCount(tiles, row - 1, col + 1);
                GameGrid.updateMineCount(tiles, row + 1, col - 1);
                GameGrid.updateMineCount(tiles, row + 1, col + 1);
                remaining--;
            }            
        }
    }

    static updateMineCount(tiles, row, col) {
        if(row >= 0 && row < tiles.length && col >= 0 && col < tiles[row].length) {
            tiles[row][col].mines += 1;
        }
    }

    handleClick(row, col) {
        this.setState((state, props) => {
            const tile = state.tiles[row][col];
            let newState = {
                'status': state.status,
                'tiles': state.tiles
            };
            if(tile.isMine) {
                tile.status = 'mine';
                newState.status = 'lost';
            } else {
                tile.status = 'open';
                state.openTiles += 1;
                if(tile.mines === 0) {
                    state.openTiles += this.revealNeighbors(state.tiles, row, col);
                    }            
                const isGameWon = state.openTiles === props.rows * props.cols - props.mines;
                newState.status = isGameWon ? 'won' : state.status === 'created' ? 'started': state.status;
            }
            if(newState.status === 'won' || newState.status === 'lost') {
                this.revealMines(newState.tiles);
                if(newState.status === 'won') {
                    newState.flags = props.mines;
                }
            }
            return newState;
        });
    }

    revealNeighbors(tiles, row, col) {
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

    revealMines(tiles) {
        for(let row of tiles) {
            for(let tile of row) {
                if(tile.isMine && tile.status === 'closed') {
                    tile.status = 'flagged';
                }
            }            
        }
    }

    handleFlag(row, col) {
        this.setState((state, props) => {
            const tile = state.tiles[row][col];
            if(tile.status === 'flagged') {
                tile.status = 'closed';
                return {
                    'status': 'started',
                    'flags': state.flags - 1,
                    'tiles': state.tiles
                };
            } else {
                tile.status = 'flagged';
                return {
                    'status': 'started',
                    'flags': state.flags + 1,
                    'tiles': state.tiles
                }
            } 
        });
    }

    resetGame() {
        this.setState((props, state) => {
            return GameGrid.initState(props);
        });
    }

    static getDerivedStateFromProps(props, state) {
        if(state.tiles.length !== props.rows || state.tiles[0].length !== props.cols) {
            return GameGrid.initState(props);
        }
        return null;    
    }

    render() {
        let tiles = [];
        for(let row of this.state.tiles) {
            for(let tile of row) {
                tiles.push(<Tile 
                    key={[tile.row, tile.col].join(',')} 
                    row={tile.row} 
                    col={tile.col} 
                    style={{msGridRow: tile.row + 1, msGridColumn: tile.col + 1}} 
                    enabled={this.state.status === 'created' || this.state.status === 'started'} 
                    status={tile.status} 
                    mines={tile.mines} 
                    handleClick={this.handleClick}
                    handleFlag={this.handleFlag}>
                </Tile>);
            }                
        }
        return (<div className="Game-grid-container">
        <Flex className="Game-menu" space="between">
            <Text weight="bold" size="large" className="Game-progress">{this.props.mines - this.state.flags}</Text>
            <Button iconOnly text icon={<EmojiIcon outline size='large' />} onClick={this.resetGame}></Button>
            <Timer key={this.state.status} enabled={this.state.status === 'started'}></Timer>          
        </Flex>
        <Grid className="Game-grid" content={tiles} columns={+this.props.cols}></Grid>
        </div>);    
    }
}

export default GameGrid;