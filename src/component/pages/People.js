import React, { useEffect, useState }  from "react";

import UsersList from "../items/UsersList";

const People = () => {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        fetch('/api/user/all', {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtZ2F3ZWNraTAwQGdtYWlsLmNvbSIsInJvbGVzIjpbInVzZXIiXSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9sb2dpbiIsImV4cCI6MTY2MzA3ODk3NH0.CzrTQNKdKhxLaBoGJ1i8z4uw0ldw2MDDyfIBwqFwN4E'
            }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            isMounted && setUsers(data);
        })
        .catch(err =>{
            console.log(err);
        })

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);


    return (
        <div>
            <p>Users</p>
            {users && <UsersList users={users} />}
        </div>
    );
};

export default People;