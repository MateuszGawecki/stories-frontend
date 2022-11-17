import Friend from "./Friend";

const FriendsList = ({ users, name}) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.user_id}>
                    <Friend user={user}/>
                </li>
            ))}
        </ul>
    );
};

export default FriendsList;