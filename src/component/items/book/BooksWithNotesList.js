import BookWithNotes from "./BookWithNotes";

const BooksWithNotesList = ({ userBooks }) => {
   
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