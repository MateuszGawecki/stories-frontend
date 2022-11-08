import "./BookWithNotes.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect, useRef } from "react";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Rating from "../Rating/Rating";

const BOOK_URL = "/api/users/books";

const BookWithNotes = ({ userBook}) => {
    const [userBook1, setUserBook1] = useState(userBook);
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();
    const newNote = useRef();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getImage = async () => {
            try {
                const response = await axiosPrivate.get("/api/image/" + userBook.bookDTO.imagePath, {
                    responseType: "blob",
                    signal: controller.signal
                });

                const imageBlob = new Blob([response.data], {
                    type: "image/jpg"
                });
    
                isMounted && setImg(URL.createObjectURL(imageBlob));
                // isMounted && setUserBook1(userBook);
            } catch (error) {
                console.error(error);
            }
        };

        getImage();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(newNote.current.value === "")
            return;

        try {
            const response = await axiosPrivate.post(BOOK_URL + "/" + userBook.userBookId + "/comments", newNote.current.value,
            {headers: {"Content-Type": "text/plain"}});

            const newBook = JSON.parse(JSON.stringify(userBook1));
            newBook.commentDTOs.push(response.data);
            setUserBook1(newBook);

        } catch (error) {
            console.error(error);
        }

         e.target.reset();
    };

    const handleTrashIcon = async (noteId) => {
        try {
            const response = await axiosPrivate.delete(BOOK_URL + "/" + userBook.userBookId + "/comments/" + noteId);

            const newBook = JSON.parse(JSON.stringify(userBook1));
            const newComments = newBook.commentDTOs.filter(comment => comment.commentId !== noteId);
            newBook.commentDTOs = newComments;
            setUserBook1(newBook);

        } catch (error) {
            console.error(error);
        }
    };

    const handleEditIcon = async (noteId, newComment) => {
        // edit comment with noteId
        //show input for newComment with placeholder as oldComment

        //editComment(userBook.userBookId, noteId, newComment);
    };

    const setNewRating = async (newRating) => {
        try {
            const response = await axiosPrivate.post(BOOK_URL + "/" + userBook.userBookId + "/score/" +newRating);

            const newBook = JSON.parse(JSON.stringify(userBook1));
            newBook.userRating=newRating;
            setUserBook1(newBook);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="userBook" id={userBook1.userBookId}>
            {img && <img src={img} alt=" " />}
            <div className="userBookInfo">
                <h5>{userBook1.bookDTO.title}</h5>
                <div className="userBookAuthors">
                    {userBook1.bookDTO.authors?.map(author => {
                        return <p>{author.authorName + " " + author.authorSurname}</p>
                    })}
                </div>

                <Rating initRating={userBook.userRating} setNewRating={setNewRating}/>

            </div>
            <div className="notesSection">
                <ul className="notes" >
                    {userBook1.commentDTOs?.map(note => (
                        <li key={note.commentId}>
                            <div className="note">
                                <p>{note.comment}</p>
                                <div className="actionIcons">
                                    <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick ={() => handleEditIcon(note.commentId)}/>
                                    <FontAwesomeIcon className="delIcon" icon={faTrashCan} onClick ={() => handleTrashIcon(note.commentId)}/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
    
                <div className="addNoteDiv">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            id="note" 
                            ref={newNote}
                            requied
                        />
                        <button>Add note</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default BookWithNotes;