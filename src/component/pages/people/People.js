import "./People.css";

import React, { useCallback, useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UsersList from "../../items/user/UsersList";
import FriendsList from "../../items/user/FriendsList";
import Pagination from "../../pagination/Pagination";
import SearchBarPeople from "../../searchBar/SearchBarPeople";

const PEOPLE_URL = "/api/users";

const PageSize = 2;

const People = () => {
    const axiosPrivate = useAxiosPrivate();
    
    const [friends, setFriends] = useState();
    
    const [users, setUsers] = useState();
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalCountUsers, setTotalCountUsers] = useState(null);
    const [totalPageCountUsers, setTotalPageCountUsers] = useState(null);

    const handleSearchChange = useCallback((searchVal) => {
        let isMounted = true;
        const controller = new AbortController();

        // const searchFriends = () => {
        //     setFriends(prevState => {

        //         const newFriends = prevState.filter(friend => )
        //     });
        //};

        const getUsersWithSearch = async () => {

            let searchQuery;
            if(!searchVal){
                searchQuery = '';
            }else{
                searchQuery = "?searchValue=" + searchVal;
            }

            try {
                const response = await axiosPrivate.get(PEOPLE_URL  + searchQuery, {
                    signal: controller.signal
                });

                console.log(response.data);
                isMounted && setUsers(response.data.users);
                isMounted && setTotalCountUsers(response.data.totalItems);
                isMounted && setTotalPageCountUsers(response.data.totalPages);
                isMounted && setCurrentPageUsers(1);
            } catch (error) {
                console.error(error);
            }
        };

        getUsersWithSearch();
        //searchFriends();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getFriends = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/friends", {
                    signal: controller.signal
                });
    
                isMounted && setFriends(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getFriends();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

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
                <SearchBarPeople handleSearchChange={handleSearchChange}/>
                {friends && <FriendsList users={friends} name="friendsList" setUsers={setFriends}/>}
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