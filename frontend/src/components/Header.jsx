import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "../api";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                setUser(decoded.sub); // `sub` - логин пользователя из JWT
            }
        }
    }, []);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(base64));
        } catch (error) {
            console.error("Ошибка при разборе JWT:", error);
            return null;
        }
    };

    const handleLogout = async () => {
        await authAPI.logout();
        localStorage.removeItem("accessToken");
        setUser(null);
        navigate("/");
    };

    const getNavLinkClass = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">NoteBin</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className={getNavLinkClass("/")} to="/">Главная</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass("/create")} to="/create">Создать заметку</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass("/my-notes")} to="/my-notes">Мои заметки</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white">👤 {user}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                        Выйти
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className={getNavLinkClass("/login")} to="/login">Войти</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
