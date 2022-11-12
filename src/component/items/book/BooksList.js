import Book from "./Book";

const BooksList = ({ books, name, setBooks, isLibrary, setRecom, setUserBooks}) => {
   
    return (
        <ul className={name} >
            {books.map(book => (
                <li key={book.bookId}>
                    <Book book={book} setBooks={setBooks} isLibrary={isLibrary} setRecom={setRecom} setUserBooks={setUserBooks}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksList;