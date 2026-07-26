import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          🛠 HunarSaathi
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/professionals">Find Help</Link>
          <Link href="/register">Register as a Professional</Link>
        </div>
      </div>
    </div>
  );
}
