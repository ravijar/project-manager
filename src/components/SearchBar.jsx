import './SearchBar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
      />
      <span className="search-icon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
};

export default SearchBar;
