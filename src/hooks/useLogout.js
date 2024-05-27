import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";

import axios from '../api/axios';

const LOGOUT_URL = '/api/security/logout';

const useLogout = () => {
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const  logout = async () => {
        setAuth({});

        try {
            const response = await axios.get(LOGOUT_URL, {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
};

export default useLogout;