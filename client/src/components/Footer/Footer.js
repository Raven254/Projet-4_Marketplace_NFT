import React from "react";
import {
  FooterContainer,
  FooterWrap,
  FooterLinkItems,
  FooterLinksContainer,
  FooterLink,
  FooterLinkTitle,
  FooterLinksWrapper,
  SocialIconLink,
  SocialIcons,
  SocialLogo,
  SocialMedia,
  SocialMediaWrap,
  WebsiteRights,
} from "./FooterElements";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrap>
        <FooterLinksContainer>
          <FooterLinksWrapper>
            <FooterLinkItems>
              <FooterLinkTitle>Nos pages</FooterLinkTitle>
              <FooterLink to="/">Accueil</FooterLink>
              <FooterLink to="/Explore">Collections</FooterLink>
              <FooterLink to="/Create">Creation</FooterLink>
              <FooterLink to="/Profil">Profil</FooterLink>
            </FooterLinkItems>
            <FooterLinkItems>
              <FooterLinkTitle>Qui sommes-nous ?</FooterLinkTitle>
              <FooterLink href="https://github.com/Raven254" target="_blank">
                Marwane El Jaafari
              </FooterLink>
              <FooterLink href="https://github.com/OlivierHQM" target="_blank">
                Olivier Huynh-Quan-Minh
              </FooterLink>
              <FooterLink
                href="https://github.com/clementlimousin"
                target="_blank"
              >
                Clément Limousin
              </FooterLink>
            </FooterLinkItems>
          </FooterLinksWrapper>
        </FooterLinksContainer>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo href="https://alyra.fr/" target="_blank">
              CMO
            </SocialLogo>
            <WebsiteRights>
              CMO © {new Date().getFullYear()} All rights reserved.
            </WebsiteRights>
            <SocialIcons>
              <SocialIconLink
                href="https://www.linkedin.com/in/cl%C3%A9ment-limousin-23b868146/"
                target="_blank"
                aria-label="Linkedin"
              >
                <FaLinkedin />
              </SocialIconLink>
            </SocialIcons>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;
