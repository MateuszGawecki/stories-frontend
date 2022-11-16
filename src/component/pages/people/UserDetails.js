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

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

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
        getUserFriends();
        getUserBooks();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return ( 
        <div className="userDetailsMainDiv">
            {user ? <User user={user} /> : null}
            {userFriends ? 
                    <ul className="userFriends">
                        {userFriends.map(user => (
                            <li key={user.user_id}>
                                <UserFriend user={user}/ >
                            </li>
                        ))}
                    </ul>
                : null
            }

            {userBooks ? 
                <ul className="libraryList" >
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