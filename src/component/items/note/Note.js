import { useState } from "react";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Note.css";

const Note = ({note, handleEditIcon, handleTrashIcon}) => {
    const [note1, setNote1] = useState(note);

    const handleOnChange = (e) =>{
        const newNote = JSON.parse(JSON.stringify(note1));
        newNote.comment = e.target.value;

        setNote1(newNote);
    }

    return (
        <div className="note">
            <input 
                value={note1.comment}
                onChange={handleOnChange}
            />
            <div className="actionIcons">
                <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick ={() => handleEditIcon(note.commentId, note1.comment)}/>
                <FontAwesomeIcon className="delIcon" icon={faTrashCan} onClick ={() => handleTrashIcon(note.commentId)}/>
            </div>
        </div>
    );
};

export default Note;