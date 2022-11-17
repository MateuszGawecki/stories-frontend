import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Select from "react-select";

const PEOPLE_URL = "/api/users";

const UserWithRoles = ({user, allRoles}) => {
    const [oldRoles, setOldRoles] = useState();
    const [newRoles, setNewRoles] = useState();
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    const handleChangeRoles = (selected) => {
        setNewRoles(selected);
    };

    const handleSubmitNewRoles = async (e) => {
        e.preventDefault();

        const grantRoleToUser = async (roleName) => {
            try {
                const response = await axiosPrivate.post(PEOPLE_URL + "/roles/" + user.userId + "/" + roleName);
            } catch (error) {
                console.error(error);
            }
        };

        const revokeRoleFromUser = async (roleName) => {
            try {
                const response = await axiosPrivate.delete(PEOPLE_URL + "/roles/" + user.userId + "/" + roleName);
            } catch (error) {
                console.error(error);
            }
        };

        const rolesGranted = newRoles.filter(r => !oldRoles.includes(r));
        const rolesRevoked = oldRoles.filter(r => !newRoles.includes(r));

        if(rolesGranted.length !== 0){
            rolesGranted.forEach(element => {
                grantRoleToUser(element.label);
            });
        }

        if(rolesRevoked.length !== 0){
            rolesRevoked.forEach(element => {
                revokeRoleFromUser(element.label);
            });
        }
    };

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

        const options = [];
        user.roles.map(role => options.push({"value" : role.roleId , "label": role.name}));
        isMounted && setNewRoles(options);
        isMounted && setOldRoles(options);
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="userWithRole">
            {img && <img src={img} alt=" " />}
            <p>{user.name + " " + user.surname}</p>
            <div className="roleManagingDiv">
                <Select className="selectRoleDiv" isMulti value={newRoles} onChange={handleChangeRoles} options={allRoles}/>
                <button onClick={(e) => handleSubmitNewRoles(e)}>Submit new roles for user</button>
            </div>
        </div>
    );
}
 
export default UserWithRoles;