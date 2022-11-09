import { useState } from "react";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Note.css";

const Note = ({note, handleEdit, handleDelete}) => {
    const [note1, setNote1] = useState(note);
    const [comment1, setComment1] = useState(note.comment);


    const handleOnChange = (e) =>{
        // const newNote = JSON.parse(JSON.stringify(note1));
        // newNote.comment = e.target.value;

        // setNote1(newNote);

        setComment1(e.target.value);
    }

    const handleEditIcon = () => {
        if(comment1 === note1.comment)
            return;
        
        const newNote = JSON.parse(JSON.stringify(note1));
        newNote.comment = comment1;
        setNote1(newNote);

        handleEdit(note1.commentId, comment1);
    };

    return (
        <div className="note">
            <input 
                value={comment1}
                onChange={handleOnChange}
            />
            <div className="actionIcons">
                <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick ={() => handleEditIcon()}/>
                <FontAwesomeIcon className="delIcon" icon={faTrashCan} onClick ={() => handleDelete(note.commentId)}/>
            </div>
        </div>
    );
};

export default Note;