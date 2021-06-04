import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import PedoCheck from './Pedometers';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const ButtonContainer = styled.View`
  position:absolute;
  left:0;
  top:0;
  width:40px;
`
const WaterInput = styled.TextInput`
  min-width: 100%;
  margin-left:auto;
  margin-right:auto;
  font-size: 30px;
  border-bottom-color: gray;
  border-bottom-width: 1px;
  text-align:center;
  color: black;
`
function Button(props)
{
  const [visible, setVisible] = useState(false);
  let number = 0;
  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
    if(isNaN(number)){
        number = number.replace(",", ".");
    }
    props.changeWater(number);
  }
  const handleInput = input => {
      number = input;
  }
  return(
    <>
      <ButtonContainer>
        <ButtonAdd title="+" onPress={showDialog}></ButtonAdd>
      </ButtonContainer>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Water</Dialog.Title>
        <Dialog.Description>
            Wprowadź ile wody wypiłeś: 
        </Dialog.Description>
        <WaterInput 
          onChangeText = {handleInput} 
          keyboardType='numeric'
        />
        <Dialog.Button label="Ok" onPress={handleCancel} />
      </Dialog.Container>
    </>
  )
}
function Parameter(props){
  let button;
  if(props.changeWater!=null) button = <Button changeWater={props.changeWater}/>
  return(
    <Container background = {props.background}>
        {button}
      <TouchableOpacity>
        <DataText>{props.amount}</DataText>
        <ParameterText>{props.parameter}</ParameterText>
      </TouchableOpacity>
    </Container>
  )
}

export default function Parameters() {
  const [waterAmount, setWater] = useState();
  useEffect(()=>{
    getWater();
  })
  const getWater = async() =>
  {
    const water = await AsyncStorage.getItem("water");
    const lastUpdate = await AsyncStorage.getItem("lastUpdate");
    const today = new Date().toDateString();
    if(water==null)
    {
      setWater(0);
    }
    else
    {
      if(lastUpdate !== today)
      {
        await AsyncStorage.setItem("water","0");
        await AsyncStorage.setItem("lastUpdate",today);
        setWater(0);
      }
      else
      {
        setWater(water);
      }
    }//jak będziesz chciał wyczyścić AsyncStorage to zakomentuj wszystko wewnątrz funkcji getWater() i wpisz await AsyncStorage.clear()
  }
  const setData = async(parameter,value) =>
  {
    await AsyncStorage.setItem(parameter,value);
    await AsyncStorage.setItem("lastUpdate",new Date().toDateString());
  }
  const changeWater = (value) => {
    let water = Number(waterAmount)+Math.floor(value);
    setData("water",String(water));
    setWater(water);
  };
  return(
    <ParametersInfo>
      <Parameter parameter='ml' background = "#1976D2" amount = {waterAmount} changeWater={changeWater}/>
      <Parameter parameter='steps' background = "#7B1FA2" amount = {<PedoCheck />} />
    </ParametersInfo>
  )
}
