import "./Books.css";

import React, { useEffect, useState, useMemo, useCallback }  from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import BooksList from "../../items/book/BooksList";
import SearchBar from "../../searchBar/SearchBar";
import Pagination from "../../pagination/Pagination";

const PageSize = 60;

const BOOK_URL = "/api/books";

const Books = () => {
    const axiosPrivate = useAxiosPrivate();

    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPageCount, setTotalPageCount] = useState(null);

    const [searchParam, setSearchParam] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const setSearch = useCallback((param, value) => {
        setSearchParam(param);
        setSearchValue(value);
    }, []);

    useEffect(() => {
        console.log("Effect na search");
        let isMounted = true;
        const controller = new AbortController();

        let searchQuery;

        if(!searchValue){
            searchQuery = '';
        }else{
            searchQuery = "?searchParameter=" + searchParam + "&searchValue=" + searchValue;
        }

        const getBooksWithSearch = async (param, value) => {
            try {
                const response = await axiosPrivate.get(BOOK_URL + searchQuery, {
                    signal: controller.signal
                });
    
                isMounted && setBooks(response.data.books);
                // isMounted && setSearchResults(response.data.books);
                isMounted && setCurrentPage(1);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getBooksWithSearch(searchParam, searchValue);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [searchValue]);

    useEffect(() => {
        console.log("Effect na currentPage");
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
                <SearchBar setSearch={setSearch}/>
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