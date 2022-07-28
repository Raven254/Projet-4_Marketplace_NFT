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
             <img src={require('../../Images/logo_alyra.jpeg').default} alt='logo' style={{
            height: 80,
            width: 100,
            paddingRight: 100,
            marginRight: 100
          }}/>
           </NavLink>
           <Bars />
           <h1 style={{color:'white',paddingRight: 100}}>Alyra's NFT</h1>
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