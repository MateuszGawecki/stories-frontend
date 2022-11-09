import "./Book.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";

const Book = ({ book }) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    //=================================================
    const { auth } = useAuth();
    
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const roles = decoded?.roles || [];

    //=================================================
    const navigate = useNavigate();
    //=================================================

    const handlePlusIcon = async (objId) => {
        try {
            const response = await axiosPrivate.post("/api/users/books/" + book.bookId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeIcon = async (objId) => {
        // navigate to edit book page
        navigate("/books/" + objId);
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
                {roles.find(role => role === 'moderator') 
                    ? <FontAwesomeIcon icon={faPenToSquare} onClick ={() => handleChangeIcon(book.bookId)} /> 
                    : null 
                }
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