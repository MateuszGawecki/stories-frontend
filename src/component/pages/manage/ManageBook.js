import "./ManageBooks.css";

import { useNavigate } from "react-router-dom";

const ModifyBook = ({book}) => {
    const navigate = useNavigate();

    return ( 
        <div className="manageBookMain">
            <button onClick={() => navigate(-1)}>Go back</button>
        </div> 
    );
}

// try {
//     const response = await axiosPrivate.delete("/api/books/" + book.bookId);
// } catch (error) {
//     console.error(error);
// }
 
export default ModifyBook;