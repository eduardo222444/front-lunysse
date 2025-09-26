// Importação de rotas do React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 
// Importa contexto de autenticação
import { useAuth } from '../context/AuthContext';
 
// Componentes reutilizáveis
import { Sidebar } from '../components/Sidebar';
import { PublicNavbar } from '../components/PublicNavbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
 
// Páginas públicas
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { NotFound } from '../pages/NotFound';
import { Relatorios } from '../pages/relatorios';
 
// Páginas protegidas (apenas para usuários autenticados)
import { DashboardPsicologo } from '../pages/DashboardPsicologo';
import { DashboardPaciente } from '../pages/DashboardPaciente';
import { Agendamento } from '../pages/Agendamento';
import { ChatIA } from '../pages/ChatIA';
import { Solicitacoes } from '../pages/Solicitacoes';
import { Pacientes } from '../pages/Pacientes';
import { PacienteDetalhes } from '../pages/PacienteDetalhes'; 
/* ==============================
   Componente de rota protegida
   ============================== */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Obtém usuário e estado de carregamento
 
    if (loading) return <LoadingSpinner size="lg" />; // Mostra spinner enquanto carrega
    if (!user) return <Navigate to="/login" replace />; // Redireciona não autenticados para login
 
    return (
        <div className="min-h-screen flex">
            <Sidebar /> {/* Sidebar lateral sempre visível */}
            <main className="flex-1 lg:ml-64 p-8">
                {children} {/* Conteúdo da página protegida */}
            </main>
        </div>
    );
};
 
/* ==============================
   Componente de rota pública
   ============================== */
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Obtém usuário e estado de carregamento
 
    if (loading) return <LoadingSpinner size="lg" />; // Mostra spinner enquanto carrega
    if (user) return <Navigate to="/dashboard" replace />; // Redireciona usuário logado para dashboard
 
    return (
        <div className="min-h-screen">
            <PublicNavbar /> {/* Navbar pública */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children} {/* Conteúdo da página pública */}
            </main>
           
        </div>
    );
};
 
/* ==============================
   Componente Dashboard condicional
   ============================== */
const Dashboard = () => {
    const { user } = useAuth();
    // Retorna dashboard específico baseado no tipo do usuário
    return user?.type === 'psicologo' ? <DashboardPsicologo /> : <DashboardPaciente />;
};
 
/* ==============================
   Configuração de rotas da aplicação
   ============================== */
export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
 
                {/* ==============================
           Rotas Públicas
           ============================== */}
                <Route path="/" element={
                    <PublicRoute>
                        <Home />
                    </PublicRoute>
                } />
 
                <Route path="/about" element={
                    <PublicRoute>
                        <About />
                    </PublicRoute>
                } />
 
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
 
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />
                  
 
                {/* ==============================
           Rotas Protegidas
           ============================== */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard /> {/* Escolhe dashboard de psicólogo ou paciente */}
                    </ProtectedRoute>
                } />
                <Route path="/agendamento" element={
                    <ProtectedRoute>
                        <Agendamento /> {/* Escolhe agendamento de psicólogo ou paciente */}
                    </ProtectedRoute>
                } />
                <Route path="/chat-ia" element={
                     <ProtectedRoute>
                         <ChatIA />
                     </ProtectedRoute>
                }/>
                 <Route path="/relatorios" element={
                     <ProtectedRoute>
                         <Relatorios/>
                     </ProtectedRoute>
                }/>
                     <Route path="/solicitacoes" element={
                    <ProtectedRoute>
                        <Solicitacoes />
                    </ProtectedRoute>
                } />
                  <Route path="/pacientes" element={
                    <ProtectedRoute>
                        <Pacientes/>
                    </ProtectedRoute>
                } />
                   <Route path="/pacientedetalhes/:id" element={
                    <ProtectedRoute>
                      <PacienteDetalhes />
                    </ProtectedRoute>
                } />
               
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
};