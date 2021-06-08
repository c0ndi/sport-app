import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useEffect, useState} from 'react';
import Dialog from 'react-native-dialog';
import styled from 'styled-components/native';

const ContainerHello = styled.View`
    margin-top: 20%;
    margin-left: 20px;
`
const HelloText = styled.Text`
    color: #CECECE;
    font-size: 25px;
`
const HelloName = styled.Text`
    color: #ffffff;
    font-size: 40px;
    font-weight: bold;
`
const NameInput = styled.TextInput`
  min-width: 100%;
  margin-left:auto;
  margin-right:auto;
  font-size: 30px;
  border-bottom-color: gray;
  border-bottom-width: 1px;
  text-align:center;
  color: black;
`
export default function Hello(props){
    const [username,setUsername] = useState();
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        getName();
    })
    let nameInput;
    const handleCancel = async () => {
        setVisible(false);
        setUsername(nameInput);
        await AsyncStorage.setItem("username",nameInput);
      }
      const handleInput = input => {
          nameInput = input;
      }
    const getName = async () => {
        let name = await AsyncStorage.getItem("username");
        if(!name)
        {
            setVisible(true);
        }
        else
        {
            setUsername(name);
        }
    }
    const welcomes = ['Hi,', 'Hello,', 'Welcome,', 'Yo!']
    const randomWelcomes = () => {
        let welcome = welcomes[Math.floor(Math.random () * welcomes.length)]     
        return welcome;
    }    
    return(
        <ContainerHello>
            <HelloText>{randomWelcomes()}</HelloText>
            <HelloName >{username}</HelloName>
            <Dialog.Container visible={visible}>
            <Dialog.Title>Username</Dialog.Title>
            <Dialog.Description>
                Enter your username:  
            </Dialog.Description>
            <NameInput 
            onChangeText = {handleInput}
            />
            <Dialog.Button label="Ok" onPress={handleCancel} />
        </Dialog.Container>
        </ContainerHello>
    )
}
