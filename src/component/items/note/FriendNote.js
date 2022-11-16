import "./Note.css";

const FriendNote = ({note}) => {

    return (
        <div className="note">
            <p>{note.comment}</p>
        </div>
    );
};

export default FriendNote;