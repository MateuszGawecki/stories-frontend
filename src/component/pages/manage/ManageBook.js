import "./ManageBooks.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const GENRES_URL = "/api/books";

const ModifyBook = ({bookId}) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const [book, setBook] = useState();
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newGenres, setNewGenres] = useState([]);
    const [newAuthors, setNewAuthors] = useState([]);
    const [newImagePath, setNewImagePath] = useState('');
    const [img, setImg] = useState();
    const [imageToSend, setImageToSend] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleDeleteBook = async () => {
        try {
            const response = await axiosPrivate.delete("/api/books/" + book.bookId);
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

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getImage = async (imagePath) => {
            try {
                const response = await axiosPrivate.get("/api/image/" + imagePath, {
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

        const getBook = async () => {
            try {
                const response = await axiosPrivate.get("/api/books/" + id, {
                    signal: controller.signal
                });

                isMounted && setBook(response.data);
                isMounted && setNewTitle(response.data.title);
                isMounted && setNewDesc(response.data.description);
                isMounted && setNewGenres(response.data.genres);
                isMounted && setNewAuthors(response.data.authors);
                isMounted && setNewImagePath(response.data.imagePath);

                getImage(response.data.imagePath);
            } catch (error) {
                console.error(error);
            }
        }

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
                    id="image" 
                    onChange={(e) => handleImageChange(e)}
                    requied
                />
                </form>
            </div>
        </div> 
    );
}
 
export default ModifyBook;