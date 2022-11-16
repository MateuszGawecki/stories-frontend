import "./Navbar.css";

import React  from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

const Navbar = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const singOut = async ()  => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <svg className="imgNavbar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 537 108">
                <text id="Stories" transform="translate(0 85)" fill="#fff" fontSize="88" fontFamily="LatinWide, Wide Latin"><tspan x="0" y="0">Stories</tspan></text>
            </svg>
            <ul>
                <li>
                    <Link to="/books" style={{ textDecoration: 'none' }}>Books</Link>
                </li>
                <li>
                    <Link to="/library" style={{ textDecoration: 'none' }}>My Library</Link>
                </li>
                <li>
                    <Link to="/people" style={{ textDecoration: 'none' }}>People</Link>
                </li>
                <li>
                    <Link to="/settings" style={{ textDecoration: 'none' }}>Settings</Link>
                </li>
            </ul>

            <button onClick={singOut}>Log out</button>
        </nav>
    );
};

export default Navbar;