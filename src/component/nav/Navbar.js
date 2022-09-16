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
            <h1>Logo Apki</h1>
            <ul>
                <li>
                    <Link to="/books">Books</Link>
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

            <button onClick={singOut}>Log out</button>
        </nav>
    );
};

export default Navbar;