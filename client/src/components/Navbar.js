import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return(
        <nav className="navbar">
            <div className="links">
            <Link to="/">Acceuil</Link>
            <Link to="/Explore">Explore</Link>
            <Link to="/Create">Create</Link>
            </div>
        </nav>
    )
}