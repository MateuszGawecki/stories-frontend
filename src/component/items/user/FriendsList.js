import Friend from "./Friend";

const FriendsList = ({ users, name, handleDeleteFriend }) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.user_id}>
                    <Friend user={user} handleDeleteFriend={handleDeleteFriend}/>
                </li>
            ))}
        </ul>
    );
};

export default FriendsList;