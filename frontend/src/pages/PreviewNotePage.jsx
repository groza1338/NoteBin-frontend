import { useParams, useNavigate } from "react-router-dom";

const PreviewNotePage = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/note/${noteId}`, { state: { previewed: true } });
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/note/${noteId}`;
        navigator.clipboard.writeText(link);
        alert("Ссылка скопирована в буфер обмена.");
    };

    return (
        <div className="container mt-5 text-center">
            <div className="alert alert-warning">
                <h4>Внимание!</h4>
                <p>Эта заметка доступна для однократного просмотра. После открытия она будет удалена.</p>
            </div>
            <button className="btn btn-primary me-3" onClick={handleView}>
                Просмотреть заметку
            </button>
            <button className="btn btn-secondary" onClick={handleCopyLink}>
                Скопировать ссылку
            </button>
        </div>
    );
};

export default PreviewNotePage;
