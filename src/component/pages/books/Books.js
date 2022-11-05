import "./Books.css";

import React, { useEffect, useState, useMemo }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import BooksList from "../../items/book/BooksList";
import SearchBar from "../../searchBar/SearchBar";
import Pagination from "../../pagination/Pagination";

const PageSize = 60;

const BOOK_URL = "/api/books";

const Books = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPageCount, setTotalPageCount] = useState(null);

    // const [searchResults, setSearchResults] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getBooks = async () => {
            try {
                const response = await axiosPrivate.get(BOOK_URL + "?page=" + (currentPage - 1), {
                    signal: controller.signal
                });
    
                isMounted && setBooks(response.data.books);
                // isMounted && setSearchResults(response.data.books);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getBooks();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPage]);

    return (
        <div className="booksMain">
            <div className="booksAside">
                {/* <SearchBar books={books} setSearchResults={setSearchResults}/> */}
            </div>
            <div className="booksListDiv">
                {books && <BooksList books={books} name="booksList"/>}
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    totalPageCount={totalPageCount}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default Books;