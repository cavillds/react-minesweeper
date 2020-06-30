import React from 'react';
import { Grid } from '@fluentui/react-northstar';
import Tile from '../Tile/Tile';
import './GameGrid.css';

class GameGrid extends React.Component {

    render() {
        let tiles = [];
        for(let row of this.props.tiles) {
            for(let tile of row) {
                tiles.push(<Tile 
                    key={[tile.row, tile.col].join(',')} 
                    row={tile.row} 
                    col={tile.col} 
                    style={{msGridRow: tile.row + 1, msGridColumn: tile.col + 1}} 
                    enabled={this.props.status === 'created' || this.props.status === 'started'} 
                    status={tile.status} 
                    mines={tile.mines} 
                    handleClick={this.props.handleClick}
                    handleFlag={this.props.handleFlag}>
                </Tile>);
            }                
        }
        return (
        <Grid className="Game-grid" content={tiles} columns={+this.props.cols}></Grid>
        );    
    }
}

export default GameGrid;