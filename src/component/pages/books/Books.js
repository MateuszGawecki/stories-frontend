import "./Books.css";

import React, { useEffect, useState, useCallback }  from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import BooksList from "../../items/book/BooksList";
import SearchBar from "../../searchBar/SearchBar";
import Pagination from "../../pagination/Pagination";

import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";

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

    //=================================================
    const { auth } = useAuth();
    
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const roles = decoded?.roles || [];

    //=================================================
    const navigate = useNavigate();
    //=================================================

    const handleButtonAddBook = (e) => {
        e.preventDefault();
        navigate("/books/add");
    };

    const handleButtonAddAuthor = (e) => {
        e.preventDefault();
        navigate("/authors/add");
    };

    const handleButtonAddGenre = (e) => {
        e.preventDefault();
        navigate("/genres/add");
    };

    const setSearch = useCallback((param, value) => {
        setSearchParam(param);
        setSearchValue(value);
    }, []);

    useEffect(() => {
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
                {roles.find(role => role === 'moderator') 
                    ? <div>
                        <button className="buttonAddBook" onClick ={(e) => handleButtonAddBook(e)}>Add new book</button>
                        <button className="buttonAddBook" onClick ={(e) => handleButtonAddAuthor(e)}>Manage authors</button>
                        <button className="buttonAddBook" onClick ={(e) => handleButtonAddGenre(e)}>Manage genres</button>
                    </div>
                    : null 
                }
                <SearchBar setSearch={setSearch}/>
            </div>
            <div className="booksListDiv">
                {books && <BooksList books={books} name="booksList" setBooks={setBooks}/>}
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