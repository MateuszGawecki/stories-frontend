import "./People.css";

import React, { useCallback, useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UsersList from "../../items/user/UsersList";
import FriendsList from "../../items/user/FriendsList";
import Pagination from "../../pagination/Pagination";
import SearchBarPeople from "../../searchBar/SearchBarPeople";

const PEOPLE_URL = "/api/users";

const PageSize = 60;

const People = () => {
    const axiosPrivate = useAxiosPrivate();
    
    const [friends, setFriends] = useState();
    const [searchedFriends, setSearchedFriends] = useState();
    
    const [users, setUsers] = useState();
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalCountUsers, setTotalCountUsers] = useState(null);
    const [totalPageCountUsers, setTotalPageCountUsers] = useState(null);

    const handleDeleteFriend = useCallback( async (friendId) => {

        try {
            const response = await axiosPrivate.delete("/api/users/friends/" + friendId);

            setFriends(prevState => {
                const newFriends = prevState.filter(friend => friend.userId !== friendId)

                return newFriends;
            });

            setSearchedFriends(prevState => {
                const newFriends = prevState.filter(friend => friend.userId !== friendId)

                return newFriends;
            });

        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleAddFriend = useCallback( async (friend) => {

        try {
            const response = await axiosPrivate.post("/api/users/friends/" + friend.userId);

            setFriends(prevState => {
                const newFriends = prevState.filter(friend => friend);
                newFriends.push(friend);
                return newFriends;
            });

            setSearchedFriends(prevState => {
                const newFriends = prevState.filter(friend => friend);
                newFriends.push(friend);
                return newFriends;
            });

        } catch (error) {
            console.error(error);
        }
    }, []);

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
                <SearchBarPeople handleSearchChange={handleSearchChange}/>
                {searchedFriends && <FriendsList users={searchedFriends} name="friendsList" handleDeleteFriend={handleDeleteFriend}/>}
            </div>
            <div className="usersListDiv">
                { users && <UsersList users={users} name="usersList" handleAddFriend={handleAddFriend}/>}
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