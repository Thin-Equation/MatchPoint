import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type Section = "product" | "features" | "pricing" | "contact" | "";

function Header() {
    const [activeSection, setActiveSection] = useState<Section>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    useEffect(() => {
        const handleScroll = () => {
            const sections: Section[] = ["product", "features", "pricing", "contact"];
            const scrollPosition = window.scrollY;

            // Set isScrolled state based on scroll position
            setIsScrolled(scrollPosition > 50);

            const active = sections.find((section) => {
                const element = document.getElementById(section);
                return element && scrollPosition + 200 >= element.offsetTop && scrollPosition + 200 < element.offsetTop + element.offsetHeight;
            });
            setActiveSection(active || "product");
        
        };
        

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => logout({ });

    const navLinks = [
        { to: "/", text: "Home" },
        { to: "/Upload", text: "Upload Resume" },
        { to: "/Contact", text: "Contact" },
    ];

    return (
        <header className={`bg-white sticky top-0 z-50 shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
            <div className="mx-auto max-w-8xl px-8 lg:px-8">
                <nav className="flex items-center justify-between" aria-label="Global">
                    <Link to="/" className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                        <span className="sr-only">MatchPoint</span>
                        <img
                            alt="MatchPoint"
                            className="h-8 w-auto"
                            src="https://www.svgrepo.com/show/266221/resume-portfolio.svg"
                        />
                    </Link>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className={`text-sm/6 font-semibold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-sm' : 'text-base'}`}>
                                {link.text}
                            </Link>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:items-center">
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <img
                                    src={user?.picture}
                                    alt={user?.name}
                                    className={`rounded-full cursor-pointer transition-all duration-300 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                />
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => loginWithRedirect()}
                                className={`rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'}`}
                            >
                                Log In
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;