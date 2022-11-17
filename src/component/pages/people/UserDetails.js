import "./UserDetails.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import User from "../../items/user/User";
import UserFriend from "../../items/user/UserFriend";
import FriendBook from "../../items/book/FriendBook";

const PEOPLE_URL = "/api/users";

const UsersDetails = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState();
    const [userFriends, setUserFriends] = useState();
    const [userBooks, setUserBooks] = useState();

    const [isFriend, setIsFriend] = useState(false);

    const handleDeleteFriend = async () => {
        try {
            const response = await axiosPrivate.delete("/api/users/friends/" + id);
            
            setIsFriend(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddFriend = async () => {
        try {
            const response = await axiosPrivate.post("/api/users/friends/" + id);
            setIsFriend(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const isFriendOfUser = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/friends/" + id, {
                    signal: controller.signal
                });
    
                setIsFriend(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/" + id, {
                    signal: controller.signal
                });
    
                isMounted && setUser(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getUserFriends = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/" + id + "/friends", {
                    signal: controller.signal
                });
    
                isMounted && setUserFriends(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getUserBooks = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "/" + id + "/books", {
                    signal: controller.signal
                });
    
                isMounted && setUserBooks(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getUser();
        isFriendOfUser();
        getUserFriends();
        getUserBooks();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [id]);

    return ( 
        <div className="userDetailsMainDiv">
            <div className="leftMainSide">
                <div className="userDetAndAction">
                    {user ? <User user={user} cName="userInUserDetails" /> : null}
                    {isFriend 
                        ? <button onClick={handleDeleteFriend}>Delete from friends</button>
                        : <button onClick={handleAddFriend}>Add to friends</button>
                    }
                </div>
                {userFriends ? 
                    <ul className="userFriendsDet">
                        {userFriends.map(user => (
                            <li key={user.user_id}>
                                <UserFriend user={user}/ >
                            </li>
                        ))}
                    </ul>
                    : null
                }
            </div>

            {userBooks ? 
                <ul className="libraryListDet" >
                    {userBooks.map(userBook => (
                        <li key={userBook.userBookId}>
                            <FriendBook userBook={userBook}/>
                        </li>
                    ))}
                </ul> 
                : null
            }
        </div>
    );
}
 
export default UsersDetails;