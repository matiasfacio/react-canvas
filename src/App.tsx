import styled from 'styled-components'
import './App.css'
import { Canvas } from './components/Canvas'
import { Expandable } from './components/Expandable'
import { Menu } from './components/Menu'
import { useState } from 'react'

export type Form = 'circle' | 'square' | 'handfree'

function App() {
  const [activeForm, setActiveForm] = useState<Form>('handfree')
  const handleClick = (form: Form) => {
  setActiveForm(form)
}

  return (
    <>
      <StyledCanvasContainer>
        <StyledMenuContainer>
          <Expandable>
            <Menu onClick={handleClick}/>
          </Expandable>
        </StyledMenuContainer>
        <Canvas activeForm={activeForm} />
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