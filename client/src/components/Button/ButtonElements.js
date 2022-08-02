import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Button = styled(Link)`
    background: ${({primary}) => ( primary ? '#01BF71' : '#010606')};
    border-radius: 50px;
    white-space: nowrap;
    padding: ${({big}) => (big ? '14px 48 px' : '12px 30px')};
    color: ${({dark}) => ( dark ? '#010606' : '#fff')};
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    outline: none;
    text-decoration: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: ${({primary}) => ( primary ? '#fff' : '#010606')};
    }
`;