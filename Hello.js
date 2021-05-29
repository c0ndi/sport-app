import React from 'react';
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

export default function Hello(props){
    let name = 'Dude'
    const welcomes = ['Hi,', 'Hello,', 'Welcome,', 'Yo!']
    const randomWelcomes = () => {
        let welcome = welcomes[Math.floor(Math.random () * welcomes.length)]     
        return welcome;
    }    
    return(
        <ContainerHello>
            <HelloText>{randomWelcomes()}</HelloText>
            <HelloName >{name}</HelloName>
        </ContainerHello>
    )
}
