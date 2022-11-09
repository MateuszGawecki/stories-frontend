import React, { useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import "./Settings.css";

const USERS_URL = "/api/users";
const SAVE_IMAGE_PATH = "/api/image";

const Settings = () => {
    const [user, setUser] = useState(null);
    const [img, setImg] = useState();
    const [newImg, setNewImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    const getImage = async (imageP) => {
        try {
            const response = await axiosPrivate.get("/api/image/" + imageP, {
                responseType: "blob"
            });

            const imageBlob = new Blob([response.data], {
                type: "image/jpg"
            });

            setImg(URL.createObjectURL(imageBlob));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserInfo = async () => {
            try {
                const response = await axiosPrivate.get(USERS_URL + "/myinfo", {
                    signal: controller.signal
                });
    
                isMounted && setUser(response.data);

                getImage(response.data.imagePath);
            } catch (error) {
                console.error(error);
            }
        };

        getUserInfo();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const saveImage = async () => {
        const formData = new FormData();
        formData.append("name", newImg.name);
        formData.append("image", newImg);

        try {
            const response = await axiosPrivate.post(
                SAVE_IMAGE_PATH,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'}
                }
            );

            //==================
            try {
                const response2 = await axiosPrivate.put(USERS_URL + "?imagePath=" + response.data);
                
                setUser(response2.data);
                getImage(response2.data.imagePath);
    
            } catch (error) {
                console.log("Save fail");
            }
            //==================
        } catch (error) {
            if (!error?.response) {
                console.log("No server response");
            } else {
                console.log('Saving Image Failed');
            }
        }
    }

    return (
        <div className="settingsMain">
            {img ? ( <div className="imageDiv">
                        <img src={img} alt=" " />
                        <input
                            type="file"
                            onChange={(e) => {
                                //console.log(event.target.files[0]);
                                setNewImg(e.target.files[0]);
                            }}
                        />
                        <button onClick={saveImage}>Submit new photo!</button>
                    </div>
                    ) 
                  : null
            }
            {user 
                ? ( <div className="userDetails">
                        <p>Name: {user.name}</p>
                        <p>Surname: {user.surname}</p>
                        <p>Email: {user.email}</p>
                        <p>Password: ***********</p>
                    </div>
                  ) 
                : null
            }
        </div>
    );
};

export default Settings;