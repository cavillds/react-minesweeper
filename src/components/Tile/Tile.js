import React from 'react';
import { Button, ErrorIcon, FlagIcon, Text } from '@fluentui/react-northstar';
import './Tile.css';

class Tile extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    colorForMines = {
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

    handleClick(e) {
        e.preventDefault();
        if(this.props.enabled && e && e.button === 0) {
            //Handle left click
            if(this.props.status === 'closed' && this.props.handleClick) {
                this.props.handleClick(this.props.row, this.props.col);
            }
        } else if(this.props.enabled && e && e.button === 2) {
            //Handle right click
            if(this.props.status !== 'open' && this.props.handleFlag) {
                this.props.handleFlag(this.props.row, this.props.col);
            }           
        }
    }
    
    render() {
        if(this.props.status === 'open') {
            return <div 
            className="Grid-tile" >
                <Text weight="bold" size="large" color={this.colorForMines[this.props.mines]}>{this.props.mines === 0 ? ' ' : this.props.mines}</Text>
            </div>;
        }
        return <Button
        className="Grid-tile" 
        iconOnly={true}
        icon={this.props.status === 'flagged' ? <FlagIcon size='large' /> : this.props.status === 'mine' ? <ErrorIcon /> : ''}
        onClick={this.handleClick}
        onContextMenu={this.handleClick}>  
        </Button>;
    }
}

export default Tile;