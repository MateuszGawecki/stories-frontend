import axios from "../api/axios";
import useAuth from "./useAuth";

const REFRESH_TOKEN_URL = "/api/user/token/refresh"

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(REFRESH_TOKEN_URL, {
            withCredentials: true
        });

        setAuth(prev => {
            return { ...prev, accessToken: response.data.access_token }
        });
    
        return response.data.access_token;
    }

    return refresh;
};

export default useRefreshToken;