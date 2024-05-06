import styled from 'styled-components'
import './App.css'
import { Canvas } from './components/Canvas'
import { Expandable } from './components/Expandable'
import { Menu } from './components/Menu'

function App() {
  return (
    <>
      <StyledCanvasContainer>
        <StyledMenuContainer>
          <Expandable>
            <Menu/>
          </Expandable>
        </StyledMenuContainer>
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
const StyledMenuContainer = styled.div`
  position: fixed;
  top: 4px;
  left: 4px;
`