import styled from "styled-components"

export const Menu = () => {
    return (
        <ul>
            <li><StyledMenuItem>Circle</StyledMenuItem></li>
            <li><StyledMenuItem>Square</StyledMenuItem></li>
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