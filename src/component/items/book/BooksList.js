import Book from "./Book";

const BooksList = ({ books, name, handleDelete, isLibrary, setRecom, setUserBooks}) => {
   
    return (
        <ul className={name} >
            {books.map(book => (
                <li key={book.bookId}>
                    <Book book={book} handleDelete={handleDelete} isLibrary={isLibrary} setRecom={setRecom} setUserBooks={setUserBooks}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksList;