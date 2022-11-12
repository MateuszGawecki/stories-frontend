import "./BookWithNotes.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect, useRef, useCallback } from "react";

import Rating from "../Rating/Rating";
import Note from "../note/Note";

const BOOK_URL = "/api/users/books";

const BookWithNotes = ({ userBook}) => {
    const [userBook1, setUserBook1] = useState(userBook);
    const [comments, setComments] = useState(userBook.commentDTOs);
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();
    const newNote = useRef();

    useEffect(() => {
        console.log("Ub");
    }, [userBook1]);

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
        
        if(newNote.current.value === "")
            return;

        console.log(userBook1.commentDTOs);
        
        try {
            const response = await axiosPrivate.post(BOOK_URL + "/" + userBook.userBookId + "/comments", newNote.current.value,
            {headers: {"Content-Type": "text/plain"}});

            console.log(userBook1.commentDTOs);

            // setUserBook1(prevState => {
            //     const newUb = prevState;
            //     newUb.commentDTOs.push(response.data);

            //     return newUb;
            // });

            // setComments(prevState => {
            //     console.log(response.data);
            //     const newComments = prevState;
            //     console.log(prevState);
            //     console.log(newComments);
            //     newComments.push(response.data);
            //     console.log(newComments);
            //     return newComments;
            // });

        } catch (error) {
            console.error(error);
        }

         e.target.reset();
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
                <p className="userBookDesc">{userBook1.bookDTO.description}</p>
                <div className="userBookAuthors">
                    {userBook1.bookDTO.authors?.map(author => {
                        return <p>{author.authorName + " " + author.authorSurname}</p>
                    })}
                </div>

                <Rating initRating={userBook.userRating} setNewRating={setNewRating}/>

            </div>
            <div className="notesSection">
                <ul className="notes" >
                    {comments?.map(note => (
                        <li key={note.commentId}>
                            <Note note ={note} ubId={userBook1.userBookId} setComments={setComments}/>
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