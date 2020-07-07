import React from 'react';
import { Button, Text } from '@fluentui/react-northstar';
import { TileState } from '../../Minesweeper';
import PropTypes from 'prop-types';
import './Tile.css';

const colorForMines = {
    0: 'brand',
    1: 'brand',
    2: 'green',
    3: 'ruby',
    4: 'grey',
    5: 'red',
    6: 'teal',
    7: 'black',
    8: 'grey'
}

export function Tile(props) {
    if(props.status === TileState.OPEN) {
        return <div 
        className="Grid-tile" >
            <Text weight="bold" size="large" color={colorForMines[props.mines]}>{props.mines === 0 ? ' ' : props.mines}</Text>
        </div>;
    }
    const handleClick = (e) => {
        e.preventDefault();
        if(props.enabled && e && e.button === 0) {
            //Handle left click
            if(props.status === TileState.CLOSED && props.handleClick) {
                props.handleClick(props.row, props.col);
            }
        } else if(props.enabled && e && e.button === 2) {
            //Handle right click
            if(props.status !== TileState.OPEN && props.handleFlag) {
                props.handleFlag(props.row, props.col);
            }           
        }    
    };
    return <Button
    className="Grid-tile" 
    iconOnly={true}
    icon={props.status === TileState.FLAGGED ? '🚩' : props.status === TileState.MINE ? '💣' : ''} 
    onClick={handleClick}
    onContextMenu={handleClick}>  
    </Button>;
}

Tile.propTypes = {
    enabled: PropTypes.bool,
    row: PropTypes.number,
    col: PropTypes.number,
    status: PropTypes.string,
    mines: PropTypes.number,
    handleClick: PropTypes.func,
    handleFlag: PropTypes.func
}