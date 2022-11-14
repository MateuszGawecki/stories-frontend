import "./User.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

const Friend = ({user}) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    const handleMinusIcon = async () => {
        //add to friends
        try {
            const response = await axiosPrivate.delete("/api/users/friends/" + user.userId);

        } catch (error) {
            console.error(error);
        }
    }

    const handleDoubleClick = () => {
        //navigate to user with id 
        // to see user private library
    }
    
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
        <div className="userDiv" onDoubleClick={handleDoubleClick}>
            {img && <img src={img} alt=" " />}
            <div className="userDetails">
                <p>{user.name + " " + user.surname}</p>
                <FontAwesomeIcon icon={faMinus} onClick ={() => handleMinusIcon()} />
            </div>
        </div>
    );
};

export default Friend;