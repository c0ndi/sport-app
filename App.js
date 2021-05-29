import React from 'react';
import Parameters from './Parameters';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Hello from './Hello'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Container = styled.View`
  height: ${windowHeight*110};
  background: ${props => props.background};
  width: ${windowWidth};
`
// Wysokość zmieniona ze względu na notch'a
export default function App() {
  return (
    <Container background = '#23272A'>
      <Hello />
      <Parameters />
    </Container>
  );
}
