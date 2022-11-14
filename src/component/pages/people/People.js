import "./People.css";

import React, { useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UsersList from "../../items/user/UsersList";
import Pagination from "../../pagination/Pagination";

const PEOPLE_URL = "/api/users";

const PageSize = 50;

const People = () => {
    const axiosPrivate = useAxiosPrivate();
    
    const [friends, setFriends] = useState();
    const [currentPageFriends, setCurrentPageFriends] = useState(1);
    const [totalCountFriends, setTotalCountFriends] = useState(null);
    const [totalPageCountFriends, setTotalPageCountFriends] = useState(null);
    
    const [users, setUsers] = useState();
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalCountUsers, setTotalCountUsers] = useState(null);
    const [totalPageCountUsers, setTotalPageCountUsers] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getFriends = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/friends?page=" + (currentPageFriends - 1), {
                    signal: controller.signal
                });
    
                isMounted && setFriends(response.data.users);
                isMounted && setTotalCountFriends(response.data.totalItems);
                isMounted && setTotalPageCountFriends(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getFriends();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPageFriends]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "?page=" + (currentPageUsers - 1), {
                    signal: controller.signal
                });

                isMounted && setUsers(response.data.users);
                isMounted && setTotalCountUsers(response.data.totalItems);
                isMounted && setTotalPageCountUsers(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPageUsers]);

    return (
        <div className="peopleMain">
            <div className="peopleAside">
                {friends && <UsersList users={friends} name="friendsList" setUsers={setFriends}/>}
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPageFriends}
                    totalCount={totalCountFriends}
                    totalPageCount={totalPageCountFriends}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPageFriends(page)}
                />
            </div>
            <div className="usersListDiv">
                { users && <UsersList users={users} name="usersList" setUsers={setUsers}/>}
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPageUsers}
                    totalCount={totalCountUsers}
                    totalPageCount={totalPageCountUsers}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPageUsers(page)}
                />
            </div>
        </div>
    );
};

export default People;