import "./User.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

const User = ({user}) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getImage = async () => {
            try {
                const response = await axiosPrivate.get("/api/image/" + user.imagePath, {
                    responseType: "blob",
                    signal: controller.signal
                });

                const imageBlob = new Blob([response.data], {
                    type: "image/jpg"
                });
    
                isMounted && setImg(URL.createObjectURL(imageBlob));
            } catch (error) {
                console.error(error);
            }
        };

        getImage();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="userDiv">
            {img && <img src={img} alt=" " />}
            <div className="userDetails">
                <p>{user.name + " " + user.surname}</p>
            </div>
        </div>
    );
};

export default User;