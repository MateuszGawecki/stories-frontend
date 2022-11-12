import { useEffect } from "react";
import BookWithNotes from "./BookWithNotes";

const BooksWithNotesList = ({ userBooks, setUserBooks }) => {

    useEffect(() => {
        console.log("List rerender");
    }, []);

    return (
        <ul className="libraryList" >
            {userBooks.map(userBook => (
                <li key={userBook.userBookId}>
                    <BookWithNotes userBook={userBook} setUserBooks={setUserBooks}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksWithNotesList;