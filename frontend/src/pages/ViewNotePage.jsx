import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notesAPI } from "../api";

const ViewNotePage = () => {
    const { noteId } = useParams(); // Получаем ID заметки из URL
    const [note, setNote] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await notesAPI.getNote(noteId);
                setNote(response);
            } catch (err) {
                setError("Ошибка при загрузке заметки. Возможно, она была удалена.");
            }
        };

        fetchNote();
    }, [noteId]);

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
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">{note.title}</h2>
                            <p className="text-muted text-center">Просмотров: {note.views}</p>

                            {note.expirationType === "BURN_AFTER_READ" && (
                                <div className="alert alert-warning text-center">
                                    ⚠️ Внимание! Эта заметка исчезнет после прочтения.
                                </div>
                            )}

                            <div className="bg-light p-3 rounded">
                                <pre className="m-0">{note.content}</pre>
                            </div>

                            <p className="mt-3"><strong>Тип хранения:</strong> {note.expirationType}</p>

                            <div className="text-center mt-4">
                                <a href="/" className="btn btn-primary">На главную</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNotePage;