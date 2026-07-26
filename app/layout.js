import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "HunarSaathi — Hire Trusted Local Professionals",
  description:
    "Describe what you need done, and instantly find and book the right local professional — plumbers, electricians, maids, movers, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
