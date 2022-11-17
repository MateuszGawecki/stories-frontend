import User from "./User";

const UsersList = ({ users, name}) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.userId}>
                    <User user={user}/>
                </li>
            ))}
        </ul>
    );
};

export default UsersList;