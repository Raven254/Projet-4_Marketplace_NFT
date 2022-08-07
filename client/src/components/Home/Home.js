import React, { useEffect, useState } from "react";
import Video from "../../videos/video_project4.mp4";
import {
  HomeContainer,
  HomeBg,
  VideoBg,
  HomeBtnWrapper,
  HomeH1,
  HomeContent,
  HomeP,
  ArrowForward,
  ArrowRight,
} from "./HomeElements";
import { Button } from "../Button/ButtonElements";
import Loader from "../Loader/Loader";

const Home = () => {
  const [hover, setHover] = useState(false);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
      console.log(loader);
    }, 1500);
  }, []);

  const onHover = () => {
    setHover(!hover);
  };
  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <HomeContainer>
          <HomeBg>
            <VideoBg autoPlay loop mutert src={Video} type="video/mp4" />
          </HomeBg>
          <HomeContent>
            <HomeH1>Bienvenue chez CMO</HomeH1>
            <HomeP>
              Cette application décentralisée permet à des artistes de créer
              leurs collections de NFT et de les mettre à la vente directe.
            </HomeP>
            <HomeBtnWrapper>
              <Button
                to="explore"
                onMouseEnter={onHover}
                onMouseLeave={onHover}
                primary="true"
                dark="true"
              >
                Explorez {hover ? <ArrowForward /> : <ArrowRight />}
              </Button>
            </HomeBtnWrapper>
          </HomeContent>
        </HomeContainer>
      )}
    </div>
  );
};

export default Home;
