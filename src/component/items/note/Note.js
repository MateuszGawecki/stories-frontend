import { useEffect, useState } from "react";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Note.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
const BOOK_URL = "/api/users/books";

const Note = ({note, ubId, setComments}) => {
    const [comment1, setComment1] = useState(note.comment);
    const axiosPrivate = useAxiosPrivate();

    const handleOnChange = (e) =>{
        setComment1(e.target.value);
    }

    const handleEditIcon = async () => {
        if(comment1 === note.comment)
            return;

        const commentId = note.commentId;
        const comment = comment1;
        try {
            const response = await axiosPrivate.put(BOOK_URL + "/" + ubId + "/comments" , JSON.stringify({commentId, comment}),
            {headers: {"Content-Type": "application/json"}});
    
            setComments(prevState => {
                const newComments = prevState.filter(com => com.commentId !== note.commentId);
                newComments.push(response.data);

                return newComments;
            });
    
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteIcon = async () => {

        try {
                const response = await axiosPrivate.delete(BOOK_URL + "/" + ubId + "/comments/" + note.commentId);
                
                setComments(prevState => {
                    return prevState.filter(comm => comm.commentId !== note.commentId);
                });
            } catch (error) {
                console.error(error);
            }
    };

    return (
        <div className="note">
            <input 
                value={comment1}
                onChange={handleOnChange}
            />
            <div className="actionIcons">
                <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick ={() => handleEditIcon()}/>
                <FontAwesomeIcon className="delIcon" icon={faTrashCan} onClick ={() => handleDeleteIcon()}/>
            </div>
        </div>
    );
};

export default Note;