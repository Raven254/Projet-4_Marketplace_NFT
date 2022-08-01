import styled from 'styled-components';
import {MdKeyboardArrowRight,MdArrowForward} from 'react-icons/md'

export const HomeContainer = styled.div`
    background: #0c0c0c;
    height: 900px;
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 0 30px;
    position: relative;
    z-index: 1:

    :before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.6) 100%
            ),
            linear-gradient(180deg,
                rgba(0, 0, 0, 0.2) 0%,
                transparent 100%
                );
                z-index: 2;
    }
`;

export const HomeBg = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
`;

export const VideoBg = styled.video`
    height: 100%;
    width: 100%;
    background: #232a34;
    -o-object-fit: cover;
    object-fit: cover;
`;

export const HomeContent = styled.div`
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 24px;
    position: absolute;
    z-index: 3:
`;

export const HomeH1 = styled.h1`
    color: #fff;
    font-size: 48px;
    text-align: center;
    @media screen and (max-width: 768px){
        font-size: 40px;
    }
    @media screen and (max-width: 480px){
        font-size: 32px;
    }
`;

export const HomeP = styled.p`
    margin-top: 24px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600px
    @media screen and (max-width: 768px){
        font-size: 24px;
    }
    @media screen and (max-width: 480px){
        font-size: 18px;
    }
`;

export const HomeBtnWrapper = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size 20px;
`;
export const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left: 8px;
    font-size 20px;
`;

