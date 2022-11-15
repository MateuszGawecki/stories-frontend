import User from "./User";

const UsersList = ({ users, name, handleAddFriend }) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.userId}>
                    <User user={user} handleAddFriend={handleAddFriend}/>
                </li>
            ))}
        </ul>
    );
};

export default UsersList;