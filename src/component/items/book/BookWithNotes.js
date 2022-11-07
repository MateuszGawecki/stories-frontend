import "./BookWithNotes.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect, useRef } from "react";

const BookWithNotes = ({ userBook, addComment }) => {
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
        
        if(newNote.current.value !== "")
            addComment(userBook.userBookId, newNote.current.value);

        e.target.reset();
    };

    return (
        <div className="userBook" id={userBook.userBookId}>
            {img && <img src={img} alt=" " />}
            <div className="userBookInfo">
                <h5>{userBook.bookDTO.title}</h5>
                <div className="userBookAuthors">
                    {userBook.bookDTO.authors?.map(author => {
                        return <p>{author.authorName + " " + author.authorSurname}</p>
                    })}
                </div>
            </div>
            <div className="notesSection">
                    {userBook.commentDTOs?.map(note => {
                        return <p>{note.comment}</p>
                    })}

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