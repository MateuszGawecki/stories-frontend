import "./ManageBooks.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Select from "react-select";

const GENRES_URL = "/api/genres/";
const AUTHORS_URL = "/api/authors/";
const CREATE_BOOK_URL = "/api/books/";
const SAVE_IMAGE_PATH = "/api/image/";

const ModifyBook = ({bookId}) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const [allGenres, setAllGenres] = useState();
    const [allAuthors, setAllAuthors] = useState();
    const [book, setBook] = useState();
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newGenres, setNewGenres] = useState([]);
    const [newAuthors, setNewAuthors] = useState([]);
    const [newImagePath, setNewImagePath] = useState();
    const [img, setImg] = useState();
    const [imageToSend, setImageToSend] = useState(null);

    const [success, setSuccess] = useState(false);

    const saveImage = async () => {
        const formData = new FormData();
        formData.append("name", imageToSend.name);
        formData.append("image", imageToSend);

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
                console.log('No Server Response');
            } else {
                console.log('Saving Image Failed')
            }
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
        
        const bookId = book.bookId;
        const title = newTitle;
        const description = newDesc;
        const globalScore = book.globalScore;
        const votes = book.votes;

        try {
            const response = await axiosPrivate.put(
                CREATE_BOOK_URL,
                JSON.stringify({bookId, title, description, authors, genres, globalScore, votes, imagePath}),
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json'}
                }
            );
            
            setSuccess(true);
        } catch (error) {
            if (!error?.response) {
                console.log('No Server Response');
            } else {
                console.log('Creation Failed')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(imageToSend){
            const imagePath = await saveImage();
            saveBook(imagePath);
        }else{
            const imagePath = book.imagePath;
            saveBook(imagePath);
        }
    }

    const handleDeleteBook = async () => {
        try {
            const response = await axiosPrivate.delete(CREATE_BOOK_URL + book.bookId);
            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    }

    const handleImageChange = (e) => {
        if(!e.target.files[0])
            return;

        setImageToSend(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setImg(objectUrl);
    }

    const handleChangeGenre = (selected) => {
        setNewGenres(selected);
    }

    const handleChangeAuthor = (selected) => {
        setNewAuthors(selected);
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getImage = async (imagePath) => {
            try {
                const response = await axiosPrivate.get(SAVE_IMAGE_PATH + imagePath, {
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

        const getBook = async () => {
            try {
                const response = await axiosPrivate.get(CREATE_BOOK_URL + id, {
                    signal: controller.signal
                });

                isMounted && setBook(response.data);
                isMounted && setNewTitle(response.data.title);
                isMounted && setNewDesc(response.data.description);
                const currentGenres = [];
                response.data.genres.map(genre => currentGenres.push({"value" : genre.genreId , "label": genre.name}));
                isMounted && setNewGenres(currentGenres);

                const currentAuthors = [];
                response.data.authors.map(author => currentAuthors.push({"value" : author.authorId , "label": author.authorName + " " + author.authorSurname}));
                isMounted && setNewAuthors(currentAuthors);

                isMounted && setNewImagePath(response.data.imagePath);

                getImage(response.data.imagePath);
            } catch (error) {
                console.error(error);
            }
        }

        getGenres();
        getAuthors();

        getBook();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return ( 
        <div className="manageBookMain">
            <button onClick={() => navigate(-1)}>Go back</button>
            <button onClick={handleDeleteBook}>Delete book</button>
            {img && <img src={img} alt=" " />}
            <div className="bookEditDiv">
                <form onSubmit={handleSubmit}>
                    <input 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />
                    <input 
                        type="file"
                        onChange={(e) => handleImageChange(e)}
                    />
                    <Select isMulti value={newGenres} onChange={handleChangeGenre} options={allGenres}/>
                    <Select isMulti value={newAuthors} onChange={handleChangeAuthor} options={allAuthors}/>
                    <button>Submit changes</button>
                </form>
            </div>

            {success ? <h3>Successful change</h3> : null}
        </div> 
    );
}
 
export default ModifyBook;