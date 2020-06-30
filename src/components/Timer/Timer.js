import React from 'react';
import { Text } from '@fluentui/react-northstar';
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
            this.setState((state, props) => ({
                'elapsedTime': state.elapsedTime + 1
            }));
        }        
    }
}

export default Timer;