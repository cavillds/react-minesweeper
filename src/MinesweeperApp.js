import React, { useState } from 'react';
import { Button, EmojiIcon, Flex, Header, Menu, Text } from '@fluentui/react-northstar';
import { GameGrid } from './components/Grid/GameGrid';
import { Timer } from './components/Timer/Timer';
import { GameState, initTiles, revealNeighbors, revealMines, TileState, replaceMine } from './Minesweeper';
import './MinesweeperApp.css';

const MENU_ITEMS = [{
  key: 'game',
  content: 'Game',
  menu: {
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

export function MinesweeperApp() {
  const [gameState, setGameState] = useState({
    rows: 9,
    cols: 9,
    mines: 10,
    status: GameState.CREATED,
    tiles: initTiles(9, 9, 10),
    openTiles: 0,
    flags: 0,
    createdAt: Date.now()
  });

  MENU_ITEMS[0].menu.onActiveIndexChange = (e, menu) => {
    handleLevelChange(menu.activeIndex, gameState, setGameState);
  };

  return (<Flex className="App" column hAlign="center">
      <Flex className="App-header-container" hAlign="center" column padding="padding.medium">
        <Header color="brand">
          Minesweeper
        </Header>
        <Menu items={MENU_ITEMS}></Menu>
      </Flex>
      <div className="Game-grid-container">
        <Flex className="Game-menu" space="between">
            <Text weight="bold" size="large" className="Game-progress">{gameState.mines - gameState.flags}</Text>
            <Button iconOnly text icon={gameState.status === GameState.LOST ? '☹' : '🙂'} onClick={() => {
              const newState = Object.assign({}, gameState);
              resetGame(newState);
              setGameState(newState);
            }}></Button>
            <Timer key={gameState.createdAt} enabled={gameState.status === GameState.STARTED}></Timer>          
        </Flex>
        <GameGrid 
        rows={gameState.rows} 
        cols={gameState.cols} 
        status={gameState.status} 
        tiles={gameState.tiles} 
        handleClick={(row, col) => {handleClick(row, col, gameState, setGameState)}}
        handleFlag={(row, col) => {handleFlag(row, col, gameState, setGameState)}}></GameGrid>
        </div>
    </Flex>);
}

function handleClick(row, col, gameState, setGameState) {  
  const newState = Object.assign({}, gameState);
  const tile = newState.tiles[row][col];
  if(newState.status === GameState.STARTED && tile.isMine) { 
    tile.status = TileState.MINE;
    newState.status = GameState.LOST;    
  } else {
    if(tile.isMine) {
      replaceMine(newState.tiles, row, col);
    }
    tile.status = TileState.OPEN;
    newState.openTiles += 1;
    if(tile.mines === 0) {
        newState.openTiles += revealNeighbors(newState.tiles, row, col);
    }            
    const isGameWon = newState.openTiles === gameState.rows * gameState.cols - gameState.mines;
    newState.status = isGameWon ? GameState.WON : newState.status === GameState.CREATED ? GameState.STARTED: newState.status;
  }
  if(newState.status === GameState.WON || newState.status === GameState.LOST) {
    revealMines(newState.tiles);
    if(newState.status === GameState.WON) {
        newState.flags = gameState.mines;
    }
  }
  setGameState(newState);
}

function handleFlag(row, col, gameState, setGameState) {
  const newState = Object.assign({}, gameState);
  const tile = newState.tiles[row][col];
  if(tile.status === TileState.FLAGGED) {
    tile.status = TileState.CLOSED;
    newState.flags -= 1;
  } else {
    tile.status = TileState.FLAGGED;
    newState.flags += 1;
  } 
  setGameState(newState);
}

function resetGame(newState) {
  newState.tiles = initTiles(newState.rows, newState.cols, newState.mines);
  newState.openTiles = 0;
  newState.flags = 0;
  newState.status = GameState.CREATED;
  newState.createdAt = Date.now();
}

function handleLevelChange(level, gameState, setGameState) {
  const newState = Object.assign({}, gameState);
  if(level === 0) {
    newState.rows = 9;
    newState.cols = 9;
    newState.mines = 10;
  } else if(level === 1) {
    newState.rows = 16;
    newState.cols = 16;
    newState.mines = 40;
  } else if(level === 2) {
    newState.rows = 16;
    newState.cols = 30;
    newState.mines = 99;
  }
  resetGame(newState);
  setGameState(newState);
}
