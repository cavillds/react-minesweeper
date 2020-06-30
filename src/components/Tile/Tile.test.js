import React from 'react';
import { Provider, teamsTheme, itemLayoutClassName } from '@fluentui/react-northstar';
import { render } from '@testing-library/react';
import { getByText, screen, getByRole } from '@testing-library/dom';
import Tile from './Tile';


describe('Renders', () => {
    test('Renders as a button when closed', () => {
        const { getByRole } = render(
            <Provider theme={teamsTheme}>
                <Tile
                enabled={true} 
                status='closed'>
                </Tile>
            </Provider>    
        );
        expect(getByRole('button')).toBeTruthy();
    });

    test('Renders as a div when open', () => {
        const { container, queryByRole } = render(
            <Provider theme={teamsTheme}>
                <Tile 
                enabled={true} 
                status='open'>
                </Tile>
            </Provider>
        );
        expect(queryByRole('button')).toBeNull();
        expect(container.querySelector('div.Grid-tile')).toBeTruthy();
    });

    test('Displays mine count when open', () => {
        const { container } = render(
            <Provider theme={teamsTheme}>
                <Tile
                enabled={true} 
                status='open' 
                mines={1}>
                </Tile>
            </Provider>
        );
        expect(getByText(container.querySelector('.Grid-tile'), '1')).toBeTruthy();
    });
}); 