import "./Library.css";

import React, { useCallback, useEffect, useState }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import BooksWithNotesList from "../../items/book/BooksWithNotesList";
import BooksList from "../../items/book/BooksList";

const BOOK_URL = "/api/users/books";
const RECOM_URL = "/api/users/books/recommended";

const Library = () => {
    const [userBooks, setUserBooks] = useState();
    const [recom, setRecom] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getBooks = async () => {
            try {
                const response = await axiosPrivate.get(BOOK_URL, {
                    signal: controller.signal
                });

                isMounted && setUserBooks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getRecomended = async () => {
            try {
                const response = await axiosPrivate.get(RECOM_URL, {
                    signal: controller.signal
                });

                isMounted && setRecom(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getBooks();
        getRecomended();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="libraryMain">
            <div className="libraryAside">
                <p>Recommended:</p>
                {recom &&  <BooksList books={recom} name="recommendedList" isLibrary={true} setRecom={setRecom} setUserBooks={setUserBooks}/>}
            </div>
            {userBooks && <BooksWithNotesList userBooks={userBooks} setUserBooks={setUserBooks}/>}
        </div>
    );
};

export default Library;