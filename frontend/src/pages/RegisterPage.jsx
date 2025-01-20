import { useState } from "react";
import { authAPI } from "../api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await authAPI.register({ login, password });
            console.log("✅ Регистрация успешна!");
            navigate("/login"); // Перенаправляем на страницу входа
        } catch (err) {
            setError("Ошибка регистрации. Логин может быть занят.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Регистрация</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleRegister}>
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
                                    <button type="submit" className="btn btn-success w-50">
                                        Зарегистрироваться
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                Уже есть аккаунт? <a href="/login">Войти</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;