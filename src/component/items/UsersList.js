import User from "./User";

const UsersList = ({ users }) => {
   
    return (
        <div>
            {users.map(user => (
                <li key={user.user_id}>
                    <User user={user} key={user.user_id}/>
                </li>
            ))}
        </div>
    );
};

export default UsersList;