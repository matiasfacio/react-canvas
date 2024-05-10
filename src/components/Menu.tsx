import styled from "styled-components"
import { Form } from "../App"

export const Menu = ({ onClick }: {onClick: (arg: Form)=> void}) => {
    return (
        <ul>
            <li><StyledMenuItem onClick={()=> onClick('circle')}>Circle</StyledMenuItem></li>
            <li><StyledMenuItem onClick={() => onClick('square')}>Square</StyledMenuItem></li>
            <li><StyledMenuItem onClick={()=> onClick('handfree')}>Hand Free</StyledMenuItem></li>
        </ul>
    )
}

const StyledMenuItem = styled.button`
    border: none;
    width: 70px;
    &:hover {
        color: #3939b2;
    }
    border-radius: 0;
`