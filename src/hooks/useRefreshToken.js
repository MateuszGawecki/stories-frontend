import axios from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const REFRESH_TOKEN_URL = "/api/security/token/refresh"

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const refresh = async () => {
        try {
            const response = await axios.get(REFRESH_TOKEN_URL, {
                withCredentials: true
            });
    
            setAuth(prev => {
                return { 
                    ...prev,
                    accessToken: response.data.access_token
                 }
            });
        
            return response.data.access_token;
        } catch (error) {
            console.error("Refresh Token Expired");
            navigate('/login', { state: { from: location }, replace: true });
        }
        
    }

    return refresh;
};

export default useRefreshToken;