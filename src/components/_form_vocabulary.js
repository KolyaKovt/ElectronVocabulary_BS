import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FormVocabulary({ vocNameRef, submit, escapeHandler }) {
  const escapeRef = useRef(null);

  useEffect(() => {
    vocNameRef.current.focus();

    const handler = (e) => escapeHandler(e, escapeRef);

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <form onSubmit={submit}>
      <input
        required
        id="name"
        type="text"
        ref={vocNameRef}
        className="form-control"
        placeholder="Vocabulary name"
      ></input>
      <Link className="btn btn-secondary" to="/" ref={escapeRef}>
        Cancel
      </Link>
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
