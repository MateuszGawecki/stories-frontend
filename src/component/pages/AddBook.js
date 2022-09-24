import { useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";

const CREATE_BOOK_URL = "/api/book";
const SAVE_IMAGE_PATH = "/api/image";

const AddBook = () => {
    const axiosPrivate = useAxiosPrivate();

    const errRef = useRef();
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorSurname, setAuthorSurname] = useState("");
    const [image, setImage] = useState(null);

    const saveImage = async () => {
        const formData = new FormData();
        formData.append("name", image.name);
        formData.append("image", image);

        try {
            const response = await axiosPrivate.post(
                SAVE_IMAGE_PATH,
                formData,
                {
                    withCredentials: true
                }
            );

            return response?.data.imageName;

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
        try {
            const response = await axiosPrivate.post(
                CREATE_BOOK_URL,
                JSON.stringify({title, description, authorName, authorSurname, imagePath}),
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
        console.log(imagePath);
        //saveBook(imagePath);
    };

    return (
        <>
        { success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <Link to="/login">Sign In</Link>
                    <button onClick={setSuccess(false)}>Add another one!</button>
                </p>
            </section>
        ) : (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Create Book</h1>
            <form onSubmit={handleSubmit}>
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

                <label htmlFor="authorName">
                    Author Name:
                </label>
                <input 
                    type="text" 
                    id="authorName" 
                    onChange={(e) => setAuthorName(e.target.value)} 
                    requied
                />

                <label htmlFor="authorSurname">
                    Author Surname:
                </label>
                <input 
                    type="text" 
                    id="authorSurname" 
                    onChange={(e) => setAuthorSurname(e.target.value)} 
                    requied
                />

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
        </>
    );
};

export default AddBook;