const SearchBarPeople = ({ handleSearchChange}) => {

    return ( 
       
        <input
            className="search_input"
            type="text"
            id="search"
            placeholder=" Search"
            onChange={(e) => handleSearchChange(e.target.value)}
        />
    );
}
 

export default SearchBarPeople;