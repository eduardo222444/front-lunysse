import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      {/* Componente que gerencia todas as rotas da aplicação */}
      <AppRoutes />
      
      {/* Componente global para exibir notificações */}
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;