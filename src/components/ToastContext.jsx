import { createContext, useContext, useState } from "react";
 
const ToastContext = createContext();
 
export const useToast = () => useContext(ToastContext);
 
export const ToastProvider = ({ children}) => {
    const [toasts, setToasts] = useState ([]);
 
    const addToast = (message, type = "info", duration = 1000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, {id, message, type}]);
 
        setTimeout(() => {
            setToasts((prev) => prev.filter ((t) => t.id !== id));
        }, duration);
    };
 
    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
 
            {/* Container de Toast */}
            <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
                {toasts.map((toast) => (
                    <div
                    key={toast.id}
                    className={`
                    max-w-xs w-full text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300
                    ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"}
                    `}
                    >
                        {toast.message}
                    </div>
                ))}
 
            </div>
        </ToastContext.Provider>
    );
};