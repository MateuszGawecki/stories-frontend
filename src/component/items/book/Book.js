import "./Book.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";

const Book = ({ book, handleDelete, isLibrary, setRecom, setUserBooks }) => {
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

    const handlePlusIcon = async () => {
        try {
            const response = await axiosPrivate.post("/api/users/books/" + book.bookId);
            console.log(response.data);

            if(isLibrary){
                setRecom(prevState => {
                    const newRecom = prevState.filter(rec => rec.bookId !== book.bookId);
                    return newRecom;
                });

                setUserBooks(prevState => {
                    const newUBs = prevState.filter(ub => ub);
                    newUBs.push(response.data);
                    return newUBs;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeIcon = async () => {
        // navigate to edit book page
        navigate("/books/" + book.bookId);
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
                    ? <div className="modAction">
                        <FontAwesomeIcon icon={faPenToSquare} onClick ={() => handleChangeIcon()} />
                        <FontAwesomeIcon icon={faTimes} onClick ={() => handleDelete(book.bookId)} />
                      </div> 
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
                    <FontAwesomeIcon icon={faPlus} onClick ={() => handlePlusIcon()} />
                </div>
            </div>
            {img && <img src={img} alt=" " />}
        </div>
    )
};

export default Book;