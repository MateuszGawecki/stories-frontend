import "./ManageGenre.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const GENRES_URL = "/api/genres";

const Genre = ({genre, setGenres}) => {
    const [genreName1, setGenreName1] = useState(genre.name);
    const axiosPrivate = useAxiosPrivate();

    const handleEditIcon = async () => {
        if(genreName1 === genre.name)
            return;

        try {
            const newGenre = {"genreId": genre.genreId, "name": genreName1};

            const response = await axiosPrivate.put(GENRES_URL, newGenre);
            
            setGenres(prevState => {
                const newGenres = prevState.filter(genre1 => genre1.genreId !== genre.genreId);
                newGenres.push(response.data);

                return newGenres;
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteIcon = async () => {
        try {
            const response = await axiosPrivate.delete(GENRES_URL + "/" + genre.genreId);
            
            setGenres(prevState => {
                const newGenres = prevState.filter(genre1 => genre1.genreId !== genre.genreId);
                return newGenres;
            });
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <>
        <input 
            value={genreName1}
            onChange={(e) => setGenreName1(e.target.value)}
        />
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleEditIcon()} />
        <FontAwesomeIcon icon={faTimes} onClick={() => handleDeleteIcon()}/>
        </>
    );
}

const ManageGenre = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [genres, setGenres] = useState();
    const newGenreName = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newGenre = {"name": newGenreName.current.value};

            const response = await axiosPrivate.post(GENRES_URL, newGenre);
            
            setGenres(prevState => {
                const newGenres = prevState.filter(genre1 => genre1);
                newGenres.push(response.data);
                return newGenres;
            });
        } catch (error) {
            console.error(error);
        }

        e.target.reset();
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getGenres = async () => {
            try {
                const response = await axiosPrivate.get(GENRES_URL, {
                    signal: controller.signal
                });
                setGenres(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        getGenres();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (  
        <div className="manageGenreMain">
            <button onClick={() => navigate(-1)}>Go back</button>
            {genres ? <ul className="allGenresList">
                            {
                                genres.map(genre => (
                                    <li key={genre.genreId}>
                                        <Genre genre={genre} setGenres={setGenres}/>
                                    </li>
                                    )
                                )
                            }
                       </ul>
                    : null
            }

            <div className="addGenreDiv">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        id="note" 
                        ref={newGenreName}
                        requied
                    />
                    <button>Add genre</button>
                </form>
            </div>
        </div>
    );
}
 
export default ManageGenre;