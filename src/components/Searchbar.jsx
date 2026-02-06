export default function SearchBar({ onSearch }) {
  return (
    <div className="p-3 bg-light border-bottom">
      <form
        className="d-flex"
        onSubmit={(e) => {
          e.preventDefault();
          const value = e.target.search.value.trim();
          onSearch(value);
        }}
      >
        <input
          name="search"
          className="form-control me-2"
          type="text"
          placeholder="Search HK80 coordinates or place name"
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}
