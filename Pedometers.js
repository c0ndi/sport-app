import React from 'react';
import {AppState} from 'react-native';
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
    currentStepCount: '',
  };

  setStepCount = async(steps) => {
    await AsyncStorage.setItem('stepsCount', String(steps));
  }
  async componentDidMount() {
    const steps = Number(await AsyncStorage.getItem("stepsCount"));
    this.setState({currentStepCount:steps});
    this._subscribe();
  }
  async componentDidUpdate(){
    await AsyncStorage.setItem("stepsCount",String(this.state.currentStepCount));
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  _subscribe = async () => {
    const steps = Number(await AsyncStorage.getItem("stepsCount")); 
    this._subscription = Pedometer.watchStepCount((result) => {
      this.setState({
        currentStepCount: (steps+result.steps),
      });
    });
  };
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    return (
        <Steps>{this.state.currentStepCount}</Steps>
    );
  }
}