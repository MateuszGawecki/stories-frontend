import Book from "./Book";

const BooksList = ({ books }) => {
   
    return (
        <div>
            {books.map(book => (
                <li key={book.book_id}>
                    <Book book={book} key={book.book_id}/>
                </li>
            ))}
        </div>
    );
};

export default BooksList;