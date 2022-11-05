import { useState }  from "react";

const SearchBar = ({ books, setSearchResults }) => {

    const [searchingAtr, setSearchingAtr] = useState("Title");

    const handleSubmit = (e) => e.preventDefault();

    const handleSearchChange = (e) => {
        if(!e.target.value) return setSearchResults(books);

        //kategorie search
        const resultArray = books.filter(book => book.title.includes(e.target.value));

        setSearchResults(resultArray);
    };

    const onChangeSelect = (e) => {
        setSearchingAtr(e.target.value);
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <h3>Searching by {searchingAtr}</h3>
            <input
                className="search_input"
                type="text"
                id="search"
                onChange={handleSearchChange}
            />
            <div className="searchingSelection" onChange={onChangeSelect}>
                <label for="Title">
                    <input type="radio" id="Title" value="title" name="searchingRadio" defaultChecked/> 
                    Title
                </label>
                <label for="Genre">
                    <input type="radio" id="Genre" value="genre" name="searchingRadio" /> 
                    Genre
                </label>
                <label for="Author">
                    <input type="radio" id="Author" value="author" name="searchingRadio" /> 
                    Author
                </label>
            </div>
        </form>
    )
}

export default SearchBar;