import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notesAPI } from "../api";

const EditNotePage = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await notesAPI.getNote(noteId);
                if (!response.available) {
                    setError("Эта заметка больше не доступна.");
                    return;
                }
                setNote(response);
                setTitle(response.title);
                setContent(response.content);
            } catch (err) {
                setError("Ошибка при загрузке заметки. Возможно, она была удалена.");
            }
        };

        fetchNote();
    }, [noteId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            await notesAPI.updateNote(noteId, { title, content }, token);
            setSuccess(true);
            setTimeout(() => navigate(`/note/${noteId}`), 1500); // ✅ Перенаправляем обратно через 1.5 сек
        } catch (err) {
            setError("Ошибка при сохранении изменений.");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">{error}</div>
                <a href="/" className="btn btn-primary">На главную</a>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Редактировать заметку</h2>

                            {success && <div className="alert alert-success">Изменения сохранены!</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSave}>
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

                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                                        {loading ? "Сохранение..." : "Сохранить"}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mt-3">
                                <a href={`/note/${noteId}`}>Отмена</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNotePage;
