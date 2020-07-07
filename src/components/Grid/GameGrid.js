import React from 'react';
import { Grid } from '@fluentui/react-northstar';
import PropTypes from 'prop-types';
import { GameState } from '../../Minesweeper';
import { Tile } from '../Tile/Tile';
import './GameGrid.css';

export function GameGrid(props) {
    let tiles = [];
    for(let row of props.tiles) {
        for(let tile of row) {
            tiles.push(<Tile 
                key={[tile.row, tile.col].join(',')} 
                row={tile.row} 
                col={tile.col} 
                style={{msGridRow: tile.row + 1, msGridColumn: tile.col + 1}} 
                enabled={props.status === GameState.CREATED || props.status === GameState.STARTED} 
                status={tile.status} 
                mines={tile.mines} 
                handleClick={props.handleClick}
                handleFlag={props.handleFlag}>
            </Tile>);
        }                
    }
    return (
    <Grid className="Game-grid" content={tiles} columns={+props.cols}></Grid>
    );
}

GameGrid.propTypes = {
    cols: PropTypes.number,
    status: PropTypes.string,
    handleClick: PropTypes.func,
    handleFlag: PropTypes.func,
    tiles: PropTypes.array
}

export default GameGrid;