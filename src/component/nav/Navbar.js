import React  from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Logo Apki</h1>
            <ul>
                <li>
                    <Link to="/">Books</Link>
                </li>
                <li>
                    <Link to="/library">My Library</Link>
                </li>
                <li>
                    <Link to="/people">People</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;