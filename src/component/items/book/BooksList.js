import Book from "./Book";

const BooksList = ({ books, name}) => {
   
    return (
        <ul className={name} >
            {books.map(book => (
                <li key={book.bookId}>
                    <Book book={book}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksList;