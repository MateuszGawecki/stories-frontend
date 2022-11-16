import "./ManageAuthor.css";
import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const AUTHORS_URL = "/api/authors";

const Author = ({author, setAuthors}) => {
    const [name1, setName1] = useState(author.authorName);
    const [surname1, setSurname1] = useState(author.authorSurname);
    const axiosPrivate = useAxiosPrivate();

    const handleEditIcon = async () => {
        if(name1 === author.authorName && surname1 === author.authorName)
            return;

        try {
            const newAuthor = {"authorId": author.authorId, "authorName": name1, "authorSurname": surname1};

            const response = await axiosPrivate.put(AUTHORS_URL, newAuthor);
            
            setAuthors(prevState => {
                const newAuthors = prevState.filter(author1 => author1.authorId !== author.authorId);
                newAuthors.push(response.data);

                return newAuthors;
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteIcon = async () => {
        try {
            const response = await axiosPrivate.delete(AUTHORS_URL + "/" + author.authorId);
            
            setAuthors(prevState => {
                const newAuthors = prevState.filter(author1 => author1.authorId !== author.authorId);
                return newAuthors;
            });
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <>
        <input 
            value={name1}
            onChange={(e) => setName1(e.target.value)}
        />
        <input 
            value={surname1}
            onChange={(e) => setSurname1(e.target.value)}
        />
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleEditIcon()} />
        <FontAwesomeIcon icon={faTimes} onClick={() => handleDeleteIcon()}/>
        </>
    );
}

const ManageAuthor = () => {
    const axiosPrivate = useAxiosPrivate();
    const [authors, setAuthors] = useState();
    const newName = useRef();
    const newSurname = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newAuthor = {"authorName": newName.current.value, "authorSurname": newSurname.current.value};

            const response = await axiosPrivate.post(AUTHORS_URL, newAuthor);
            
            setAuthors(prevState => {
                const newAuthors = prevState.filter(author1 => author1);
                newAuthors.push(response.data);
                return newAuthors;
            });
        } catch (error) {
            console.error(error);
        }

        e.target.reset();
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAuthors = async () => {
            try {
                const response = await axiosPrivate.get(AUTHORS_URL, {
                    signal: controller.signal
                });
                setAuthors(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        getAuthors();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return ( 
        <div className="manageAuthorMain">
            {authors ? <ul className="allAuthorsList">
                            {
                                authors.map(author => (
                                    <li key={author.authorId}>
                                        <Author author={author} setAuthors={setAuthors}/>
                                    </li>
                                    )
                                )
                            }
                       </ul>
                    : null
            }

            <div className="addAuthorDiv">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        id="note" 
                        ref={newName}
                        requied
                    />
                    <input 
                        type="text" 
                        id="note" 
                        ref={newSurname}
                        requied
                    />
                    <button>Add author</button>
                </form>
            </div>
        </div>
     );
}
 
export default ManageAuthor;