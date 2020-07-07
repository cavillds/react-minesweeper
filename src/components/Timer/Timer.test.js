import React from 'react';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { act, render } from '@testing-library/react';
import { Timer } from './Timer';

const objectUnderTest = (<Provider theme={teamsTheme}><Timer enabled={true}></Timer></Provider>);

const disabledObjUnderTest = (<Provider theme={teamsTheme}><Timer enabled={false}></Timer></Provider>);

jest.useFakeTimers();

describe('Renders', () => {
    test('as span', () => {
        const { container } = render(objectUnderTest);
        expect(container).toBeTruthy();
        expect(container.querySelector('span.Timer')).toBeTruthy();
    });
});

describe('when enabled', () => {
    test('starts timer', () => {
        render(objectUnderTest);
        expect(setInterval).toBeCalled();
    });

    test('updates count', () => {
        const { getByText } = render(objectUnderTest);
        act(() => jest.advanceTimersByTime(3000));
        expect(getByText('3')).toBeTruthy(); 
        act(() => jest.advanceTimersByTime(2000));
        expect(getByText('5')).toBeTruthy();    
    });
});

describe('when disabled', () => {
    test('does not update count', () => {
        const { queryByText } = render(disabledObjUnderTest);
        act(() => jest.advanceTimersByTime(4000));
        expect(queryByText('4')).toBeNull();
        expect(queryByText('0')).toBeTruthy();
    });
})