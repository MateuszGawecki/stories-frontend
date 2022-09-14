const User = ({ user }) => {
    return (
        <div className="user" key={user.user_id}>
            <p>{user.name}</p>
            <p>{user.surname}</p>
        </div>
    )
};

export default User;