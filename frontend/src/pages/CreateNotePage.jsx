import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notesAPI } from "../api";

const CreateNotePage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [expirationType, setExpirationType] = useState("NEVER");
    const [expirationPeriod, setExpirationPeriod] = useState("10m");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Функция для преобразования в ISO 8601 Duration (PT30M, PT1H)
    const convertToIsoDuration = (period) => {
        switch (period) {
            case "10m":
                return "PT10M";
            case "30m":
                return "PT30M";
            case "1h":
                return "PT1H";
            default:
                return null;
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const noteData = { title, content, expirationType };
            if (expirationType === "BURN_BY_PERIOD") {
                noteData.expirationPeriod = convertToIsoDuration(expirationPeriod); // ✅ Добавляем PT30M, PT1H
            }

            const response = await notesAPI.createNote(noteData);
            if (response.url) {
                navigate(`/note/${response.url}`);
            } else {
                throw new Error("Сервер не вернул URL заметки.");
            }
        } catch (err) {
            setError(err.message || "Ошибка при создании заметки. Попробуйте снова.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Создать заметку</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleCreateNote}>
                                <div className="mb-3">
                                    <label className="form-label">Название</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Содержимое</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Тип хранения</label>
                                    <select
                                        className="form-select"
                                        value={expirationType}
                                        onChange={(e) => setExpirationType(e.target.value)}
                                    >
                                        <option value="NEVER">Хранить всегда</option>
                                        <option value="BURN_AFTER_READ">Сжечь после прочтения</option>
                                        <option value="BURN_BY_PERIOD">Удалить через время</option>
                                    </select>
                                </div>

                                {expirationType === "BURN_BY_PERIOD" && (
                                    <div className="mb-3">
                                        <label className="form-label">Выберите срок хранения</label>
                                        <select
                                            className="form-select"
                                            value={expirationPeriod}
                                            onChange={(e) => setExpirationPeriod(e.target.value)}
                                        >
                                            <option value="10m">10 минут</option>
                                            <option value="30m">30 минут</option>
                                            <option value="1h">1 час</option>
                                        </select>
                                    </div>
                                )}

                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-success btn-sm">
                                        Создать заметку
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                <a href="/">Вернуться на главную</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotePage;