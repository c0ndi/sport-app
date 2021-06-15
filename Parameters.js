import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity,Dimensions,Alert,AppState,Animated } from 'react-native';
import { Pedometer } from 'expo-sensors';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Easing } from 'react-native-reanimated';

const windowHeight = Dimensions.get('window').height;

const ParametersInfo = styled(Animated.View)`
  margin-top: 7%;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  height: ${windowHeight}px;
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
`
const ButtonContainer = styled.View`
  position:absolute;
  left:0;
  top:0;
  width:75px;
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
  const [stepsCount, setSteps] = useState();
  let _subscription;
  let firstStepsCount;
  const yesterdayActivityAlert = (lastUpdate,water,steps) =>
  {
    let dateString = new Date(Date.parse(lastUpdate));
    let day = dateString.getDate();
    if(day<10) day = "0"+day;
    let month = dateString.getMonth()+1;
    if(month<10) month = "0"+month;
    let year = dateString.getFullYear();
    Alert.alert(
      day+"."+month+"."+year+" activity report",
      `Water: ${water}\nSteps: ${steps}`,
      [
        {
          text:"OK"
        }
      ]
    )
  }
  const getValues = async() =>
  {
    const water = await AsyncStorage.getItem("water");
    const stepsCount = await AsyncStorage.getItem("stepsCount");
    const lastUpdate = await AsyncStorage.getItem("lastUpdate");
    const today = new Date().toDateString();
    if(water == null || isNaN(stepsCount)) {
      await AsyncStorage.setItem("water","0");
      await AsyncStorage.setItem("stepsCount","0");
      await AsyncStorage.setItem("lastUpdate",today);
      setWater(0);
      setSteps(0);
    }
    else {
      if(lastUpdate !== today)
      {
        yesterdayActivityAlert(lastUpdate, water,stepsCount);
        _subscription.remove();
        _subscription = null;
        firstStepsCount = 0;
        await AsyncStorage.setItem("water","0");
        await AsyncStorage.setItem("stepsCount","0");
        await AsyncStorage.setItem("lastUpdate",today);
        setWater(0);
        setSteps(0);
        _subscription = Pedometer.watchStepCount(async (result) => {
          setSteps(firstStepsCount+result.steps);
          await AsyncStorage.setItem("stepsCount",String(firstStepsCount+result.steps));
        });
      }
      else
      {
        setWater(water);
        setSteps(stepsCount);
      }
    }
  }
  const setData = async(parameter,value) =>
  {
    await AsyncStorage.setItem(parameter,value);
  }
  const changeWater = (value) => {
    let water = Number(waterAmount) + Math.floor(value);
    setData("water", String(water));
    setWater(water);
  };
  _subscribe = async () => {
    firstStepsCount = Number(await AsyncStorage.getItem("stepsCount"));
    _subscription = Pedometer.watchStepCount(async (result) => {
      setSteps(firstStepsCount+result.steps);
      await AsyncStorage.setItem("stepsCount",String(firstStepsCount+result.steps));
    });
  };
  _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };
  const opacity = new Animated.Value(0);
  useEffect(()=>{
    getValues();
    AppState.addEventListener("change", checkDate = async () => {
      await getValues();
    });
    _subscribe();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
    return () => {
      AppState.removeEventListener("change",checkDate);
      _unsubscribe();
    }
  },[]);
  return(
    <ParametersInfo style={{opacity}}>
      <Parameter parameter='ml' background = "#1976D2" amount = {waterAmount} changeWater={changeWater}/>
      <Parameter parameter='steps' background = "#7B1FA2" amount = {stepsCount} />
    </ParametersInfo>
  )
}


