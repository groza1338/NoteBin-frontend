import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateNotePage from "./pages/CreateNotePage";
import MyNotesPage from "./pages/MyNotesPage";
import ViewNotePage from "./pages/ViewNotePage";
import Header from "./components/Header";
import EditNotePage from "./pages/EditNotePage.jsx";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create" element={<CreateNotePage />} />
                <Route path="/my-notes" element={<MyNotesPage />} />
                <Route path="/note/:noteId" element={<ViewNotePage />} />
                <Route path="/edit/:noteId" element={<EditNotePage />} />

            </Routes>
        </Router>
    );
}

export default App;
