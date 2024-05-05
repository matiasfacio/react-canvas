import styled from 'styled-components'
import './App.css'
import { Canvas } from './components/Canvas'

function App() {
  return (
    <>
      <StyledCanvasContainer>
        <Canvas />
      </StyledCanvasContainer>
    </>
  )
}

export default App

const StyledCanvasContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-content: center;
`
