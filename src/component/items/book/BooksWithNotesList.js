import { useEffect } from "react";
import BookWithNotes from "./BookWithNotes";

const BooksWithNotesList = ({ userBooks }) => {

    useEffect(() => {
        console.log("List rerender");
    }, []);

    return (
        <ul className="libraryList" >
            {userBooks.map(userBook => (
                <li key={userBook.userBookId}>
                    <BookWithNotes userBook={userBook}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksWithNotesList;