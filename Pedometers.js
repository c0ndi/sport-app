import React from 'react';
import styled from 'styled-components/native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Steps = styled.Text`
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
`

export default class PedoCheck extends React.Component {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };

  setStepCount = async(steps) => await AsyncStorage.setItem('stepsCount', steps)

  componentDidMount() {
    this._subscribe();
  }
  componentDidUpdate() {
    this.setStepCount(this.state.currentStepCount)
  }
  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps,
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result),
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  };

  render() {
    return (
        <Steps>{this.state.currentStepCount}</Steps>
    );
  }
}