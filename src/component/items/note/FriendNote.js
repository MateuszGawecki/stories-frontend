import "./Note.css";

const FriendNote = ({note}) => {

    return (
        <div className="noteDet">
            <p>{note.comment}</p>
        </div>
    );
};

export default FriendNote;