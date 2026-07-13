import { Link } from "react-router-dom";

export default function Denied() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1 style={{ color: "red" }}>
        Access Denied
      </h1>

      <p>
        You don't have permission to access this page.
      </p>

      <Link to="/">
        Go Back
      </Link>
    </div>
  );
}