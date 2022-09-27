import React, { useEffect, useState }  from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import BooksList from "../items/BooksList";

const BOOK_URL = "/api/book";

const Books = () => {
    const [books, setBooks] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getBooks = async () => {
            try {
                const response = await axiosPrivate.get(BOOK_URL, {
                    signal: controller.signal
                });

                isMounted && setBooks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getBooks();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div>
            <p>Books</p>
            {books && <BooksList books={books} />}
        </div>
    );
};

export default Books;