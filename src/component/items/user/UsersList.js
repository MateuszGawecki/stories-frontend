import User from "./User";

const UsersList = ({ users, name, cName}) => {
   
    return (
        <ul className={name}>
            {users.map(user => (
                <li key={user.userId}>
                    <User user={user} cName={cName}/>
                </li>
            ))}
        </ul>
    );
};

export default UsersList;