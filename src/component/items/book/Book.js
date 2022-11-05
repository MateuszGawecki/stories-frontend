import "./Book.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Book = ({ book }) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    const handlePlusIcon = async (objId) => {
        console.log("Book id is " + objId);

        // add to library

        try {
            const response = await axiosPrivate.post("/api/users/books/" + book.bookId);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getImage = async () => {
            try {
                const response = await axiosPrivate.get("/api/image/" + book.imagePath, {
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
        <div className="book" id={book.bookId}>
            <div className="bookInfo">
                <h4>{book.title}</h4>
                <div className="bookAuthors">
                    {book.authors?.map(author => {
                        return <p>{author.authorName + " " + author.authorSurname}</p>
                    })}
                </div>
                <p className="bookDesc">{book.description}</p>
                <div className="bookSocialAction">
                    <p>Grade: {book.globalScore} ({book.votes})</p>
                    <FontAwesomeIcon icon={faPlus} onClick ={() => handlePlusIcon(book.bookId)} />
                </div>
            </div>
            {img && <img src={img} alt=" " />}
        </div>
    )
};

export default Book;