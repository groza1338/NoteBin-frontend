import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notesAPI } from "../api";

const MyNotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await notesAPI.getUserNotes(token);
                console.log("✅ Полученные заметки:", response);

                if (response && response.page && Array.isArray(response.page.content)) {
                    const filteredNotes = response.page.content.filter(note => note.available); // ✅ Оставляем только доступные
                    setNotes(filteredNotes);
                } else {
                    console.error("❌ Ожидался массив заметок в `response.page.content`, но получено:", response);
                    setNotes([]);
                }
            } catch (err) {
                setError("Ошибка при загрузке заметок. Возможно, ваш токен истёк.");
            }
        };

        fetchNotes();
    }, [navigate]);

    const handleDelete = async (noteId) => {
        try {
            const token = localStorage.getItem("accessToken");
            await notesAPI.deactivateNote(noteId, token);
            setNotes((prevNotes) => prevNotes.filter((note) => note.url !== noteId));
        } catch (err) {
            setError("Ошибка при удалении заметки.");
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

    return (
        <div className="container mt-5">
            <h2 className="text-center">Мои заметки</h2>

            {notes.length === 0 ? (
                <p className="text-center">У вас пока нет доступных заметок.</p>
            ) : (
                <div className="list-group">
                    {notes.map((note) => (
                        <div key={note.url} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{note.title}</h5>
                                <p className="text-muted">Тип: {note.expirationType || "Не указан"}</p>
                            </div>
                            <div>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/note/${note.url}`)}>
                                    Просмотр
                                </button>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/edit/${note.url}`)}>
                                    ✏️ Редактировать
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(note.url)}>
                                    🗑️ Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-4">
                <a href="/" className="btn btn-primary">На главную</a>
            </div>
        </div>
    );
};

export default MyNotesPage;
