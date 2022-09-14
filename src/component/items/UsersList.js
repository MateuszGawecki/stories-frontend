import User from "./User";

const UsersList = ({ users }) => {
   
    return (
        <div>
            {users.map(user => (
                <User user={user} key={user.user_id}/>
            ))}
        </div>
    );
};

export default UsersList;