import React, { useEffect, useState } from 'react';
import { Text } from '@fluentui/react-northstar';
import PropTypes from 'prop-types';
import './Timer.css';

function Timer (props) {

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            if(props.enabled) {
                setElapsedTime(elapsedTime + 1);
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };    
    });

    return (
        <Text weight="bold" size="large" className="Timer">{elapsedTime}</Text>
    );
}

Timer.propTypes = {
    enabled: PropTypes.bool
}

export default Timer;