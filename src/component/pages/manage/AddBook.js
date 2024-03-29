import { useState, useRef, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Select from "react-select";

import "./AddBook.css";

const CREATE_BOOK_URL = "/api/books";
const SAVE_IMAGE_PATH = "/api/images";
const GENRES_URL = "/api/genres/";
const AUTHORS_URL = "/api/authors/";

const AddBook = () => {
    const axiosPrivate = useAxiosPrivate();

    const [allGenres, setAllGenres] = useState();
    const [allAuthors, setAllAuthors] = useState();
    const [newGenres, setNewGenres] = useState([]);
    const [newAuthors, setNewAuthors] = useState([]);

    const errRef = useRef();
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getGenres = async () => {
            try {
                const response = await axiosPrivate.get(GENRES_URL, {
                    signal: controller.signal
                });

                const options = [];

                response.data.map(genre => options.push({"value" : genre.genreId , "label": genre.name}));

                isMounted && setAllGenres(options);
            } catch (error) {
                console.error(error);
            }
        }

        const getAuthors = async () => {
            try {
                const response = await axiosPrivate.get(AUTHORS_URL, {
                    signal: controller.signal
                });

                const options = [];

                response.data.map(author => options.push({"value" : author.authorId , "label": author.authorName + " " + author.authorSurname}));


                isMounted && setAllAuthors(options);
                
            } catch (error) {
                console.error(error);
            }
        }

        getGenres();
        getAuthors();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const saveImage = async () => {
        const formData = new FormData();
        formData.append("name", image.name);
        formData.append("image", image);

        try {
            const response2 = await axiosPrivate.post(
                SAVE_IMAGE_PATH,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'}
                }
            );

            return response2?.data;

        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Saving Image Failed')
            }
            errRef.current.focus();
        }
    }

    const saveBook = async (imagePath) => {
        var authors = new Array();
        newAuthors.map(newAuthor => {
            const names = newAuthor.label.split(' ');
            authors.push({"authorId": newAuthor.value, "authorName": names[0], "authorSurname": names[1]});
        });

        var genres = new Array();
        newGenres.map(newGenre => genres.push({"genreId": newGenre.value, "name": newGenre.label}));

        const globalScore = 0;
        const votes = 0;

        try {
            const response = await axiosPrivate.post(
                CREATE_BOOK_URL,
                JSON.stringify({title, description, authors, genres, globalScore, votes, imagePath}),
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json'}
                }
            );

            setSuccess(true);

        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Creation Failed')
            }
            errRef.current.focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imagePath = await saveImage();
        saveBook(imagePath);
    };

    const handleChangeGenre = (selected) => {
        setNewGenres(selected);
    }

    const handleChangeAuthor = (selected) => {
        setNewAuthors(selected);
    }

    return (
        <div className="addBookMainDiv">
        { success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <button onClick={() => setSuccess(false)}>Add another one!</button>
                </p>
            </section>
        ) : (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form className="formAddBook" onSubmit={handleSubmit}>
                <label htmlFor="title">
                    Title:
                </label>
                <input 
                    type="text" 
                    id="title" 
                    onChange={(e) => setTitle(e.target.value)} 
                    requied 
                />

                <label htmlFor="description">
                    Description:
                </label>
                <textarea
                    rows="5"
                    id="description" 
                    onChange={(e) => setDescription(e.target.value)} 
                    requied
                />

                <label htmlFor="Genres">
                    Genres:
                </label>
                <Select id="Genres" className="select" isMulti value={newGenres} onChange={handleChangeGenre} options={allGenres}/>

                <label htmlFor="Authors">
                    Authors:
                </label>
                <Select id="Authors" className="select" isMulti value={newAuthors} onChange={handleChangeAuthor} options={allAuthors}/>

                <label htmlFor="image">
                    Image:
                </label>
                <input 
                    type="file" 
                    id="image" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    requied
                />

                <button>Submit</button>
            </form>
        </section>
        )}
        </div>
    );
};

export default AddBook;