import React from 'react';
import { Text } from '@fluentui/react-northstar';
import PropTypes from 'prop-types';
import './Timer.css';

class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'elapsedTime': 0
        };
    }

    startTimer() {
        this.setState({
            'elapsedTime': 0
        });
        this.timerId = setInterval(() => {
            this.tick();    
        }, 1000);
    }

    componentDidMount() {
        this.startTimer();
    }

    render() {
        return (
            <Text weight="bold" size="large" className="Timer">{this.state.elapsedTime}</Text>
        );
    }

    stopTimer() {
        if(this.timerId) {
            clearInterval(this.timerId);
        }        
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    tick() {
        if(this.props.enabled) {
            this.setState((state) => ({
                'elapsedTime': state.elapsedTime + 1
            }));
        }        
    }
}

Timer.propTypes = {
    enabled: PropTypes.bool
}

export default Timer;