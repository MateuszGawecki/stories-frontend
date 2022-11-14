import Friend from "./Friend";

const FriendsList = ({ users, name }) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.user_id}>
                    <Friend user={user} key={user.user_id}/>
                </li>
            ))}
        </ul>
    );
};

export default FriendsList;