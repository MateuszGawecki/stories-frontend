import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";

const LOGOUT_URL = '/api/security/logout';

const useLogout = () => {
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const  logout = async () => {
        setAuth({});

        try {
            const response = await axiosPrivate.post(LOGOUT_URL, {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
};

export default useLogout;