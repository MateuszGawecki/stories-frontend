import User from "./User";

const UsersList = ({ users, name }) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.user_id}>
                    <User user={user} key={user.user_id}/>
                </li>
            ))}
        </ul>
    );
};

export default UsersList;