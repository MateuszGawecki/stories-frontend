import BookWithNotes from "./BookWithNotes";

const BooksWithNotesList = ({ userBooks, addComment }) => {

    return (
        <ul className="libraryList" >
            {userBooks.map(userBook => (
                <li key={userBook.userBookId}>
                    <BookWithNotes userBook={userBook} addComment={addComment}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksWithNotesList;