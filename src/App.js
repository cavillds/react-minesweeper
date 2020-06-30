import React from 'react';
import { Flex, Header, Menu } from '@fluentui/react-northstar';
import GameGrid from './components/Grid/GameGrid';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: 9,
      cols: 9,
      mines: 10
    };
    this.handleLevelChange = this.handleLevelChange.bind(this);
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
  }

  handleLevelChange(e, menu) {
    const level = menu.activeIndex;
    this.setState((state, props) => {
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
  }

  render() {
    return (<Flex className="App" column hAlign="center">
      <Flex className="App-header-container" hAlign="center" column padding="padding.medium">
        <Header color="brand">
          Minesweeper
        </Header>
        <Menu items={this.menuItems}></Menu>
      </Flex>
      <GameGrid rows={this.state.rows} cols={this.state.cols} mines={this.state.mines}></GameGrid>
    </Flex>);
  }  
}

export default App;
