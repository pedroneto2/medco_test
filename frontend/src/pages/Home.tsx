import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/tasks">Tasks</Link>
      </nav>
    </div>
  );
}
