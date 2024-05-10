import { ReactNode, useState } from "react";
import styled from "styled-components";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";

export const Expandable = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true)
    return <StyledButton $isOpen={isOpen}>
        {isOpen ? <FiArrowLeftCircle size={30} onClick={() => setIsOpen(!isOpen)} /> : <FiArrowRightCircle size={30} onClick={() => setIsOpen(!isOpen)} />}
        {isOpen && children}
    </StyledButton>
}

const StyledButton = styled.div<{$isOpen: boolean}>`
    width: ${({ $isOpen }) => $isOpen ? 'fit-content' : 'fit-content'};
    transition: width ease 200ms;
`;