import "./BookWithNotes.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";

const BookWithNotes = ({ userBook }) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getImage = async () => {
            try {
                const response = await axiosPrivate.get("/api/image/" + userBook.bookDTO.imagePath, {
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

        getImage();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="userBook" id={userBook.userBookId}>
            {img && <img src={img} alt=" " />}
            <div className="userBookInfo">
                <h5>{userBook.bookDTO.title}</h5>
            </div>
            <div className="notesSection">
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
                <p>Dupa</p>
            </div>
        </div>
    )
};

export default BookWithNotes;