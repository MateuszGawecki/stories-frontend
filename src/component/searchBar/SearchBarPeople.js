const SearchBarPeople = ({ handleSearchChange}) => {

    return ( 
        <input
            className="search_input"
            type="text"
            id="search"
            onChange={(e) => handleSearchChange(e.target.value)}
        />
    );
}
 

export default SearchBarPeople;