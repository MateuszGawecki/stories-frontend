import React, { useEffect, useState }  from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UsersList from "../items/user/UsersList";

const PEOPLE_URL = "/api/user/all";

const People = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL, {
                    signal: controller.signal
                });

                isMounted && setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div>
            <p>Users</p>
            {users && <UsersList users={users} />}
        </div>
    );
};

export default People;