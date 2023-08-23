export default function Search({ action, searchRef }) {
  return (
    <form onSubmit={action} className="search-form">
      <div className="inputInForm">
        <input
          required
          id="name"
          type="text"
          ref={searchRef}
          className="form-control"
          placeholder="Search"
        ></input>
      </div>
      <div className="buttonInput">
        <button className="btn btn-primary">Search</button>
      </div>
    </form>
  )
}
