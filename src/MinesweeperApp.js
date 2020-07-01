import React from 'react';
import { Button, EmojiIcon, Flex, Header, Menu, Text } from '@fluentui/react-northstar';
import GameGrid from './components/Grid/GameGrid';
import Timer from './components/Timer/Timer';
import { initTiles, revealNeighbors, revealMines } from './Minesweeper';
import './MinesweeperApp.css';

class MinesweeperApp extends React.Component {

  constructor(props) {
    super(props);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFlag = this.handleFlag.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.menuItems = [{
      key: 'game',
      content: 'Game',
      menu: {
        onActiveIndexChange: this.handleLevelChange,
        items: [
          {
            key: 'beginner',
            content: 'Beginner'
          }, {
            key: 'intermediate',
            content: 'Intermediate'
          }, {
            key: 'advanced',
            content: 'Advanced'
          }
        ]
      }
    },{
      key: 'display',
      content: 'Display'
    },{
      key: 'controls',
      content: 'Controls'
    }];
    this.state = {
        rows: 9,
        cols: 9,
        mines: 10,
        status: 'created',
        tiles: initTiles(9, 9, 10),
        openTiles: 0,
        flags: 0,
        createdAt: Date.now()
    };
  }

  handleClick(row, col) {
    this.setState((state) => {
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
                state.openTiles += revealNeighbors(state.tiles, row, col);
                }            
            const isGameWon = state.openTiles === state.rows * state.cols - state.mines;
            newState.status = isGameWon ? 'won' : state.status === 'created' ? 'started': state.status;
        }
        if(newState.status === 'won' || newState.status === 'lost') {
            revealMines(newState.tiles);
            if(newState.status === 'won') {
                newState.flags = state.mines;
            }
        }
        return newState;
    });
  }

  handleFlag(row, col) {
    this.setState((state) => {
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
    this.setState((state) => {
      return {
        status: 'created',
        tiles: initTiles(state.rows, state.cols, state.mines),
        openTiles: 0,
        flags: 0,
        createdAt: Date.now()
      }
    });
  }

  handleLevelChange(e, menu) {
    const level = menu.activeIndex;
    this.setState(() => {
      if(level === 0) {
        return {
          rows: 9,
          cols: 9,
          mines: 10
        }
      } else if(level === 1) {
        return {
          rows: 16,
          cols: 16,
          mines: 40
        }
      } else if(level === 2) {
        return {
          rows: 16,
          cols: 30,
          mines: 99
        }
      }
    });
    this.resetGame();
  }

  render() {
    return (<Flex className="App" column hAlign="center">
      <Flex className="App-header-container" hAlign="center" column padding="padding.medium">
        <Header color="brand">
          Minesweeper
        </Header>
        <Menu items={this.menuItems}></Menu>
      </Flex>
      <div className="Game-grid-container">
        <Flex className="Game-menu" space="between">
            <Text weight="bold" size="large" className="Game-progress">{this.state.mines - this.state.flags}</Text>
            <Button iconOnly text icon={<EmojiIcon outline size='large' />} onClick={this.resetGame}></Button>
            <Timer key={this.state.createdAt} enabled={this.state.status === 'started'}></Timer>          
        </Flex>
        <GameGrid 
        rows={this.state.rows} 
        cols={this.state.cols} 
        status={this.state.status} 
        tiles={this.state.tiles} 
        handleClick={this.handleClick}
        handleFlag={this.handleFlag}></GameGrid>
        </div>
    </Flex>);
  }  
}

export default MinesweeperApp;
