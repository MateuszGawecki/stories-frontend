import React, { useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Settings.css";

const USERS_URL = "/api/users";
const SECUR_URL = "/api/security";
const SAVE_IMAGE_PATH = "/api/image";
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Settings = () => {
    const [user, setUser] = useState(null);
    const [img, setImg] = useState();
    const [newImg, setNewImg] = useState();
    const [newName, setNewName] = useState('');
    const [newSurname, setNewSurname] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
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
                isMounted && setNewName(response.data.name);
                isMounted && setNewSurname(response.data.surname);

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

    const handleNewPassword = (newPas) => {
        setNewPassword(newPas);
        const result = PASSWORD_REGEX.test(newPas);
        if(result)
            setValidPassword(true);
        else
            setValidPassword(false);
    };

    const submitInfo = async (property, value) => {
        try {
            const response2 = await axiosPrivate.put(USERS_URL + "?" + property + "=" + value);
            
            return response2.data;

        } catch (error) {
            console.log("Save fail");
        }
    };

    const saveImage = async () => {
        const formData = new FormData();
        formData.append("name", newImg.name);
        formData.append("image", newImg);

        try {
            var imageName = user.imagePath;
            const response = await axiosPrivate.post(
                SAVE_IMAGE_PATH + "?imageName=" + imageName,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'}
                }
            );

            //==================
            const data = await submitInfo("imagePath", response.data);
            setUser(data);
            getImage(data.imagePath);
            //==================
        } catch (error) {
            if (!error?.response) {
                console.log("No server response");
            } else {
                console.log('Saving Image Failed');
            }
        }
    };

    const changePassword = async () => {
        try {
            const response2 = await axiosPrivate.put(SECUR_URL + "/password",
            new URLSearchParams(({'oldPassword': oldPassword, 'newPassword': newPassword })),
            { headers : {'Content-Type': 'application/x-www-form-urlencoded'}});

        } catch (error) {
            console.log("Password fail");
        }
    };

    const submitUserDetails = async () => {
        if(newName !== user.name){
            const data = await submitInfo("name", newName);
            setUser(data);
            setNewName(data.name);
        }

        if(newSurname !== user.surname){
            const data = await submitInfo("surname", newSurname);
            setUser(data);
            setNewName(data.name);
        }

        if(validPassword && oldPassword){
            await changePassword();
            setOldPassword('');
            setNewPassword('');
        }
    };

    return (
        <div className="settingsMain">
            {img ? ( <div className="imageDiv">
                        <img src={img} alt=" " />
                        <input
                            type="file"
                            onChange={(e) => {
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
                        <div className="detCont">
                        <p>Email: {user.email}</p>

                        <label htmlFor="name">Name: </label>
                        <input 
                            id="name"
                            value={newName}
                            onChange={ (e) => setNewName(e.target.value)}
                        />
                        <label htmlFor="surname">Surname: </label>
                        <input 
                            id="surname"
                            value={newSurname}
                            onChange = { (e) => setNewSurname(e.target.value)}
                        />
                        <label htmlFor="oldPassword">Old Password: </label>
                        <input 
                            value={oldPassword}
                            id="oldPassword"
                            type="password"
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <label htmlFor="newPassword">New Password: 
                            <FontAwesomeIcon icon={faTimes} className={passwordFocus && !validPassword ? "invalid" : "hide"} /> 
                        </label>
                        <input
                            value={newPassword}
                            id="newPassword"
                            type="password"
                            aria-invalid={validPassword ? "false" : "true"}
                            onChange={ (e) => handleNewPassword(e.target.value)}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p className={passwordFocus && !validPassword ? "instructions" : "offscreen"}> 
                            New password must contain of
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters. <br /> 
                            A number and a special character.<br />
                            Allowed special characters: ! @ # $ %
                        </p>
                        <button onClick={submitUserDetails}>Submit new user info!</button>
                        </div>
                    </div>
                  ) 
                : null
            }
        </div>
    );
};

export default Settings;