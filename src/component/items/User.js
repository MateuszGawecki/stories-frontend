const User = ({ user }) => {
    return (
        <div className="user" id={user.user_id}>
            <p>{user.name}</p>
            <p>{user.surname}</p>
        </div>
    )
};

export default User;