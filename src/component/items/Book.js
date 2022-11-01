import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";

const Book = ({ book }) => {
    const [img, setImg] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const getImage = async () => {
            try {
                const response = await axiosPrivate.get("/api/image/" + book.imagePath, {
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
        <div className="book" id={book.user_id}>
            <p>{book.title}</p>
            {/* {img && <img src={img} alt=" " />} */}
        </div>
    )
};

export default Book;