import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../nav/Navbar";
import Footer from "./footer/Footer";

const Layout = () => {
    const location = useLocation();

    return (
        <main className="App">
            { location.pathname !== '/login' && location.pathname !== '/register' && <Navbar /> }
            <Outlet />
            <Footer />
        </main>
    );
};

export default Layout;