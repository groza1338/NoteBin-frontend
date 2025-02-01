const API_AUTH = import.meta.env.VITE_API_AUTH || "http://localhost:8081/api/v1";
const API_NOTES = import.meta.env.VITE_API_NOTES || "http://localhost:8080/api/v1";

// Глобальная переменная для хранения access-токена
let accessToken = localStorage.getItem("accessToken") || null;

// Функция для установки нового токена
const setAccessToken = (token) => {
    accessToken = token;
    localStorage.setItem("accessToken", token); // ✅ Сохраняем токен в localStorage
};

// Универсальная функция для запросов
const request = async (url, method = "GET", data = null, useAuth = false) => {
    const headers = { "Content-Type": "application/json" };

    // ✅ Добавляем токен, если он есть
    if (useAuth && accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const options = {
        method,
        headers,
        credentials: "include", // ✅ Включаем куки для refresh-токена
        body: data ? JSON.stringify(data) : null,
    };

    let response = await fetch(url, options);

    // ✅ Если токен истёк (401), пробуем обновить и повторить запрос
    if (response.status === 401 && useAuth) {
        console.warn("🔄 Access-токен истёк, обновляем...");
        const newToken = await authAPI.refreshToken();

        if (newToken) {
            console.log("✅ Новый токен получен:", newToken);
            setAccessToken(newToken);
            headers["Authorization"] = `Bearer ${newToken}`; // ✅ Используем новый токен
            response = await fetch(url, options); // ✅ Повторяем запрос
        } else {
            console.error("❌ Не удалось обновить токен. Требуется повторный вход.");
            logoutAndRedirectToLogin(); // ✅ Выход из аккаунта
            return;
        }
    }

    // ✅ Проверяем, есть ли тело в ответе
    const text = await response.text();
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        json = text; // Если ответ - не JSON, просто возвращаем текст
    }

    if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return json;
};


// 🔹 API для аутентификации
export const authAPI = {
    login: async (credentials) => {
        const response = await request(`${API_AUTH}/auth/login`, "PATCH", credentials);

        if (typeof response === "string") {
            setAccessToken(response);
            return { accessToken: response };
        }

        if (response.accessToken) {
            setAccessToken(response.accessToken);
        }

        return response;
    },

    logout: () => {
        setAccessToken(null); // ✅ Удаляем токен при выходе
        localStorage.removeItem("accessToken");
        return request(`${API_AUTH}/auth/logout`, "PATCH", null, true);
    },

    verifyToken: () => request(`${API_AUTH}/auth/verify-access`, "POST", { accessToken }, true),

    refreshToken: async () => {
        try {
            const response = await fetch(`${API_AUTH}/auth/refresh`, {
                method: "GET",
                credentials: "include", // ✅ Передаём куки
            });

            if (!response.ok) {
                console.error("❌ Ошибка обновления токена:", response.status);
                logoutAndRedirectToLogin();
                return null;
            }

            const newToken = await response.text(); // ✅ Получаем новый токен
            console.log("✅ Новый accessToken:", newToken);

            if (typeof newToken === "string") {
                setAccessToken(newToken);
                return newToken;
            }

            console.error("❌ Сервер не вернул токен!");
            return null;
        } catch (error) {
            console.error("❌ Ошибка обновления токена:", error);
            logoutAndRedirectToLogin();
            return null;
        }
    },

    register: (credentials) => request(`${API_AUTH}/user/register`, "POST", credentials),
};

// 🔹 API для работы с заметками
export const notesAPI = {
    getNote: (noteId) => request(`${API_NOTES}/note/${noteId}`, "GET", null, true),
    createNote: (noteData, token) => request(`${API_NOTES}/note`, "POST", noteData, true), // ✅ Передаём токен как Bearer
    updateNote: (noteId, updatedData) => request(`${API_NOTES}/note/${noteId}`, "PUT", updatedData, true),
    deactivateNote: (noteId) => request(`${API_NOTES}/note/${noteId}`, "PATCH", null, true),
    getUserNotes: (token, page = 0) => request(`${API_NOTES}/note/list/me?page=${page}`, "GET", null, true),
    getAnalytics: (urls) => request(`${API_NOTES}/analytics/view-notes`, "POST", { urls }, true),
};

import { useNavigate } from "react-router-dom";

export const logoutAndRedirectToLogin = () => {
    console.warn("❌ Токен истёк. Выход из аккаунта...");
    localStorage.removeItem("accessToken");
    accessToken = null;
    window.location.href = "/login"; // ✅ Перенаправляем на страницу входа
};