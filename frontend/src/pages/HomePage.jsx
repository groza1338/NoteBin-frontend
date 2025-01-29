import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [noteId, setNoteId] = useState("");
    const navigate = useNavigate();

    // Проверяем, есть ли токен (если есть, значит пользователь залогинен)
    const isAuthenticated = !!localStorage.getItem("accessToken");

    const handleGoToNote = () => {
        if (noteId.trim()) {
            navigate(`/note/${noteId}`);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="mb-4">NoteBin</h2>

                            {/* Поле ввода для заметки */}
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Введите ID заметки"
                                    value={noteId}
                                    onChange={(e) => setNoteId(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleGoToNote}>
                                    Перейти
                                </button>
                            </div>

                            {/* Кнопка для создания заметки */}
                            <button className="btn btn-success w-100 mb-3" onClick={() => navigate("/create")}>
                                Создать заметку
                            </button>

                            {/* Кнопки авторизации / перехода в личный кабинет */}
                            {!isAuthenticated ? (
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-outline-primary w-45" onClick={() => navigate("/login")}>
                                        Войти
                                    </button>
                                    <button className="btn btn-outline-success w-45" onClick={() => navigate("/register")}>
                                        Регистрация
                                    </button>
                                </div>
                            ) : (
                                <button className="btn btn-info w-100" onClick={() => navigate("/my-notes")}>
                                    Мои заметки
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;