import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider, teamsTheme, itemLayoutClassName } from '@fluentui/react-northstar';
import { render } from '@testing-library/react';
import { getByText, screen, getByRole } from '@testing-library/dom';
import Tile from './Tile';

const objectUnderTest = (status, enabled=true, onClick=null, onFlag=null) => (<Provider theme={teamsTheme}>
                                                        <Tile
                                                        row={1}
                                                        col={3}
                                                        mines={2}
                                                        enabled={enabled} 
                                                        status={status}
                                                        handleClick={onClick}
                                                        handleFlag={onFlag}>
                                                        </Tile>
                                                        </Provider>);

describe('Renders', () => {
    test('Renders as a button when closed', () => {
        const { getByRole } = render(objectUnderTest('closed'));
        expect(getByRole('button')).toBeTruthy();
    });

    test('Renders as a div when open', () => {
        const { container, queryByRole } = render(objectUnderTest('open'));
        expect(queryByRole('button')).toBeNull();
        expect(container.querySelector('div.Grid-tile')).toBeTruthy();
    });

    test('Displays mine count when open', () => {
        const { container } = render(objectUnderTest('open'));
        expect(getByText(container.querySelector('.Grid-tile'), '2')).toBeTruthy();
    });
});

describe('onClick', () => {

    test('triggers callback on enabled tile', () => {
        const callback = jest.fn();
        const { getByRole } = render(objectUnderTest('closed', true, callback, null));
        ReactTestUtils.Simulate.click(getByRole('button'), {button: 0});
        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(1, 3);
    });

    test('does not trigger callback on disabled tile', () => {
        const callback = jest.fn();
        const { getByRole } = render(objectUnderTest('closed', false, callback, null));
        ReactTestUtils.Simulate.click(getByRole('button'), {button: 0});
        expect(callback).not.toHaveBeenCalled();
    });

    test('does not trigger callback on flagged tile', () => {
        const callback = jest.fn();
        const { getByRole } = render(objectUnderTest('flagged', true, callback, null));
        ReactTestUtils.Simulate.click(getByRole('button'), {button: 0});
        expect(callback).not.toHaveBeenCalled();    
    })
});

describe('onRightClick', () => {

    test('triggers callback on enabled tile', () => {
        const callback = jest.fn();
        const { getByRole } = render(objectUnderTest('closed', true, null, callback));
        ReactTestUtils.Simulate.contextMenu(getByRole('button'), {button: 2});
        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(1, 3);
    });
});