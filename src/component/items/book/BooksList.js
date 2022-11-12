import Book from "./Book";

const BooksList = ({ books, name, handleDelete}) => {
   
    return (
        <ul className={name} >
            {books.map(book => (
                <li key={book.bookId}>
                    <Book book={book} handleDelete={handleDelete}/>
                </li>
            ))}
        </ul>
    );
};

export default BooksList;