import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { notesAPI } from "../api";

const ViewNotePage = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [note, setNote] = useState(null);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [viewsData, setViewsData] = useState(null);

    useEffect(() => {
        const fetchNotePreview = async () => {
            try {
                const preview = await notesAPI.getPreview(noteId);
                if (preview.expirationType === "BURN_AFTER_READ" && !location.state?.previewed) {
                    navigate(`/preview/${noteId}`);
                } else {
                    fetchNote();
                }
            } catch (err) {
                setError("Ошибка при загрузке предварительного просмотра заметки.");
            }
        };

        const fetchNote = async () => {
            try {
                const response = await notesAPI.getNote(noteId);
                console.log("✅ Получены данные заметки:", response);

                if (!response.createdAt) {
                    throw new Error("Ошибка: createdAt отсутствует в данных заметки.");
                }

                setNote(response);

                if (response.expirationType === "BURN_BY_PERIOD" && response.expirationPeriod) {
                    startCountdown(response);
                }

                fetchViewsAnalytics(noteId);
            } catch (err) {
                console.error("❌ Ошибка при загрузке заметки:", err);
                setError("Ошибка при загрузке заметки. Возможно, она была удалена.");
            }
        };

        fetchNotePreview();
    }, [noteId, navigate, location.state]);

    const fetchViewsAnalytics = async (noteId) => {
        try {
            const response = await notesAPI.getAnalytics([noteId]);
            console.log("📊 Аналитика просмотров:", response);

            if (response[noteId]) {
                setViewsData(response[noteId]); // ✅ Сохраняем просмотры
            }
        } catch (err) {
            console.error("❌ Ошибка при загрузке аналитики:", err);
        }
    };

    const startCountdown = (noteData) => {
        if (!noteData.createdAt) {
            console.error("❌ Ошибка: createdAt отсутствует в заметке.");
            return;
        }

        const createdTime = parseCreatedAt(noteData.createdAt);
        if (!createdTime) {
            console.error("❌ Ошибка: createdAt имеет неверный формат:", noteData.createdAt);
            return;
        }

        const durationMs = convertIsoDurationToMs(noteData.expirationPeriod);
        if (!durationMs) {
            console.error("❌ Ошибка: Неверный формат expirationPeriod.", noteData.expirationPeriod);
            return;
        }

        const expirationTime = createdTime + durationMs;
        console.log("⏳ Время истечения (локальное):", new Date(expirationTime).toLocaleString());

        const updateTimer = () => {
            const now = Date.now();
            const timeRemaining = expirationTime - now;

            if (timeRemaining <= 0) {
                setTimeLeft("00:00");
                clearInterval(timer);
                navigate("/"); // Перенаправляем на главную после истечения времени
            } else {
                setTimeLeft(formatTime(timeRemaining));
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    };

    const parseCreatedAt = (createdAt) => {
        if (Array.isArray(createdAt) && createdAt.length >= 6) {
            console.log("🔄 Преобразуем массив createdAt в локальное время:", createdAt);
            return new Date(createdAt[0], createdAt[1] - 1, createdAt[2], createdAt[3], createdAt[4], createdAt[5]).getTime();
        }
        if (typeof createdAt === "string") {
            console.log("🔄 Преобразуем строку createdAt в локальное время:", createdAt);
            return new Date(createdAt).getTime();
        }
        console.error("❌ Ошибка: Неверный формат createdAt:", createdAt);
        return null;
    };

    const convertIsoDurationToMs = (duration) => {
        if (typeof duration === "number") {
            console.log(`🔄 Преобразуем число ${duration} секунд в миллисекунды`);
            return duration * 1000;
        }

        if (typeof duration !== "string" || !duration.startsWith("PT")) {
            console.error("❌ Ошибка: Неверный формат expirationPeriod:", duration);
            return null;
        }

        let minutes = 0;
        let hours = 0;

        if (duration.includes("H")) {
            hours = parseInt(duration.match(/(\d+)H/)?.[1] || "0", 10);
        }
        if (duration.includes("M")) {
            minutes = parseInt(duration.match(/(\d+)M/)?.[1] || "0", 10);
        }

        const ms = (hours * 60 + minutes) * 60 * 1000;
        console.log(`🔄 Преобразован ${duration} → ${ms} мс`);
        return ms;
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

    const totalViews = viewsData ? viewsData.userViews + viewsData.anonymousViews : note.views; // ✅ Считаем суммарные просмотры

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">{note.title}</h2>
                            <p className="text-muted text-center">
                                📊 Просмотров: {totalViews}
                            </p>

                            {note.expirationType === "BURN_BY_PERIOD" && timeLeft && (
                                <div className="alert alert-danger text-center">
                                    ⏳ Осталось времени: <strong>{timeLeft}</strong>
                                </div>
                            )}

                            <div className="bg-light p-3 rounded">
                                <pre className="m-0">{note.content}</pre>
                            </div>

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
