import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect} from "react";

import Rating from "../Rating/Rating";
import FriendNote from "../note/FriendNote";

const BOOK_URL = "/api/users/books";

const FriendBook = ({ userBook }) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

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

    return (
        <div className="userBook" id={userBook.userBookId}>
            {img && <img src={img} alt=" " />}
            <div className="userBookInfo">
                <h5>{userBook.bookDTO.title}</h5>
                <p className="userBookDesc">{userBook.bookDTO.description}</p>
                <div className="userBookAuthors">
                    {userBook.bookDTO.authors?.map(author => {
                        return <p>{author.authorName + " " + author.authorSurname}</p>
                    })}
                </div>

                <Rating initRating={userBook.userRating}/>

            </div>
            <div className="notesSection">
                <ul className="notes" >
                    {userBook.commentDTOs?.map(note => (
                        <li key={note.commentId}>
                            <FriendNote note ={note}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default FriendBook;