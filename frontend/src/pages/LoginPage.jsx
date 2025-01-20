import { useState } from "react";
import { authAPI } from "../api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Сбрасываем ошибку

        try {
            const response = await authAPI.login({ login, password });
            console.log("✅ Вход выполнен:", response);
            navigate("/notes"); // Перенаправляем на страницу заметок
        } catch (err) {
            setError("Ошибка входа. Проверьте логин и пароль.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Вход</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Логин</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-primary w-50">
                                        Войти
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;