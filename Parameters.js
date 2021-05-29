import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import PedoCheck from './Pedometers';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const ParametersInfo = styled.View`
  margin-top: 7%;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  height: ${windowHeight};
  margin-left: auto;
  margin-right: auto;
` 

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content:space-evenly;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  height: 33%;
  background-color: ${props => props.background};
  margin-top: 20px;
`;

const DataText = styled.Text`
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
`

const ParameterText = styled.Text`
  color: #CECECE;
  font-size: 20px;
  text-align: center;
`
const ButtonAdd = styled.Button`
  width:50px;
  height:50px;
`
function Parameter(props){
  return(
    <Container background = {props.background}>
      <ButtonAdd title="+" onPress={props.changeWater}/>
      <TouchableOpacity>
        <DataText>{props.amount}</DataText>
        <ParameterText>{props.parameter}</ParameterText>
      </TouchableOpacity>
    </Container>
  )
}

export default function Parameters() {
  const [waterAmount, setWater] = useState(12);
  const changeWater = () => {
    setWater(waterAmount+50);
  };
  return(
    <ParametersInfo>
      <Parameter parameter='ml' background = "#1976D2" amount = {waterAmount} changeWater={changeWater}/>
      <Parameter parameter='steps' background = "#7B1FA2" amount = {<PedoCheck />} />
    </ParametersInfo>
  )
}
