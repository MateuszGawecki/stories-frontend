import "./People.css";

import React, { useCallback, useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UsersList from "../../items/user/UsersList";
import Pagination from "../../pagination/Pagination";
import SearchBarPeople from "../../searchBar/SearchBarPeople";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";

const PEOPLE_URL = "/api/users";

const PageSize = 30;

const People = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    
    const [friends, setFriends] = useState();
    const [searchedFriends, setSearchedFriends] = useState();
    
    const [users, setUsers] = useState();
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalCountUsers, setTotalCountUsers] = useState(null);
    const [totalPageCountUsers, setTotalPageCountUsers] = useState(null);

    //=======================
    const { auth } = useAuth();
    
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const roles = decoded?.roles || [];

    const isAdmin = roles.find(role => role === 'admin') ? true : false;
    //=======================

    const handleButtonManageRoles = (e) => {
        e.preventDefault();
        navigate("/people/roles/manage");
    };

    const handleSearchChange = useCallback((searchVal) => {
        let isMounted = true;
        const controller = new AbortController();

        const searchFriends = () => {
            setSearchedFriends(prevState => {
                
                if(!searchVal)
                    return friends;

                const names = searchVal.split(' ');
                const newFriends = prevState.filter(friend => {
                    if(names.length === 2)
                        return friend.name.includes(names[0]) && friend.surname.includes(names[1]);
                    else if(names.length === 1)
                        return friend.name.includes(names[0]) || friend.surname.includes(names[0]);
                    else if(names.length > 2)
                        return null;
                })

                return newFriends;
            });
        };

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

                isMounted && setUsers(response.data.users);
                isMounted && setTotalCountUsers(response.data.totalItems);
                isMounted && setTotalPageCountUsers(response.data.totalPages);
                isMounted && setCurrentPageUsers(1);
            } catch (error) {
                console.error(error);
            }
        };

        getUsersWithSearch();
        searchFriends();

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
                isMounted && setSearchedFriends(response.data);
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
                {isAdmin ? <button className="buttonManageRoles" onClick ={(e) => handleButtonManageRoles(e)}>Manage users roles</button> : null}
                <SearchBarPeople handleSearchChange={handleSearchChange}/>
                {searchedFriends && <UsersList users={searchedFriends} cName="friendDiv" name="friendsList"/>}
            </div>
            <div className="usersListDiv">
                { users && <UsersList users={users} name="usersList"/>}
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