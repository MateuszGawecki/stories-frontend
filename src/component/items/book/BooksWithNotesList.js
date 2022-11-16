import { useEffect } from "react";
import BookWithNotes from "./BookWithNotes";

const BooksWithNotesList = ({ userBooks, setUserBooks }) => {

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