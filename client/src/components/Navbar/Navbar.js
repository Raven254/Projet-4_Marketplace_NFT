import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
  } from './NavbarElements';

export default function Navbar() {
    return(
         <>
         <Nav>
           <NavLink to='/'>
             <img src={require('../../Images/al_log.png').default} alt='logo' style={{
            height: 75,
            width: 120,
            paddingRight: 100,
            marginRight: 100,
            backgroundColor: "transparent"
          }}/>
           </NavLink>
           <Bars />
           <NavMenu>
             <NavLink to='/Explore' activeStyle>
               Explore
             </NavLink>
             <NavLink to='/Create' activeStyle>
               Create
             </NavLink>
           </NavMenu>
           <NavBtn>
             <NavBtnLink to='/Profil'>Profil</NavBtnLink>
           </NavBtn>
         </Nav>
       </>
    )
}