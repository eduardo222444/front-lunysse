/* ==============================
   COMPONENTE SIDEBAR REUTILIZÁVEL
   ============================== */
// Este componente cria uma barra lateral de navegação que se adapta
// ao tipo de usuário (psicólogo ou paciente) e é responsiva para mobile
 
// Importações necessárias do React e bibliotecas
import { useState } from 'react'; // Hook para gerenciar estado local
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Hooks do React Router para navegação
import { useAuth } from '../context/AuthContext'; // Contexto personalizado para autenticação
import { Menu, X, LogOut, BarChart3, Calendar, User, Users, MessageCircle, Bell } from 'lucide-react'; // Ícones SVG
 
export const Sidebar = () => {
  /* ==============================
     ESTADOS E HOOKS
     ============================== */
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
 
  // Obtém dados do usuário logado e função de logout do contexto
  const { user, logout } = useAuth();
 
  // Hook para navegação programática (redirecionar via código)
  const navigate = useNavigate();
 
  // Hook para obter informações da rota atual
  const location = useLocation();
 
  /* ==============================
     FUNÇÕES AUXILIARES
     ============================== */
  // Função que executa o logout do usuário
  const handleLogout = () => {
    logout(); // Limpa os dados do usuário do contexto
    navigate('/login'); // Redireciona para a página de login
  };
 
  // Função que verifica se uma rota específica está ativa (sendo visualizada)
  const isActive = (path) => location.pathname === path;
 
  /* ==============================
     CONFIGURAÇÃO DOS LINKS DE NAVEGAÇÃO
     ============================== */
  // Array de links que muda dependendo do tipo de usuário
  // Usa operador ternário para decidir quais links mostrar
  const navLinks = user?.type === 'psicologo'
    ? [
        // Links específicos para PSICÓLOGOS
        { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { to: '/solicitacoes', label: 'Solicitações', icon: Bell },
        { to: '/pacientes', label: 'Pacientes', icon: Users },
        { to: '/chat-ia', label: 'Chat IA', icon: MessageCircle },
        { to: '/relatorios', label: 'Relatórios', icon: BarChart3 }
      ]
    : [
        // Links específicos para PACIENTES
        { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { to: '/agendamento', label: 'Solicitar Sessão', icon: Calendar }
      ];
 
  /* ==============================
     RENDERIZAÇÃO DO COMPONENTE
     ============================== */
  return (
    <>
      {/* ==============================
         BOTÃO HAMBÚRGUER (MOBILE ONLY)
         ============================== */}
      {/* Este botão só aparece em telas pequenas (lg:hidden)
          Permite abrir/fechar o menu lateral em dispositivos móveis */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Alterna entre aberto/fechado
        className="lg:hidden fixed top-4 left-4 z-50 bg-dark text-white p-2 rounded-lg shadow-lg"
        aria-label="Menu" // Acessibilidade para leitores de tela
      >
        {/* Mostra ícone X quando aberto, ícone Menu quando fechado */}
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
 
      {/* ==============================
         SIDEBAR PRINCIPAL
         ============================== */}
      {/* Container da sidebar com animação de slide */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-dark shadow-xl transform transition-transform duration-300 z-40 ${
        // Lógica de posicionamento:
        // - Mobile: escondida por padrão (-translate-x-full), visível quando isOpen é true
        // - Desktop: sempre visível (lg:translate-x-0)
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Container flexbox que ocupa toda a altura */}
        <div className="flex flex-col h-full">
         
          {/* ==============================
             SEÇÃO DO LOGO
             ============================== */}
          <div className="flex items-center space-x-3 p-6 border-b border-white/10">
            <img src="/logo.png" alt="Lunysse" className="w-10 h-10 rounded-lg" />
            <div>
              <span className="text-xl font-bold text-white">Lunysse</span>
              <p className="text-xs text-white/60">Sistema Psicológico</p>
            </div>
          </div>
 
          {/* ==============================
             INFORMAÇÕES DO USUÁRIO LOGADO
             ============================== */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {/* Avatar circular com gradiente */}
              <div className="w-10 h-10 bg-gradient-to-br from-light to-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                {/* Nome do usuário obtido do contexto */}
                <p className="text-white font-medium">{user?.name}</p>
                {/* Tipo do usuário (paciente/psicólogo) com primeira letra maiúscula */}
                <p className="text-xs text-white/60 capitalize">{user?.type}</p>
              </div>
            </div>
          </div>
 
          {/* ==============================
             MENU DE NAVEGAÇÃO PRINCIPAL
             ============================== */}
          {/* flex-1 faz esta seção ocupar todo o espaço disponível */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {/* Mapeia o array navLinks para criar os itens do menu */}
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to} // Rota de destino
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      // Aplica estilos diferentes se a rota está ativa
                      isActive(link.to)
                        ? 'bg-light text-white' // Estilo para rota ativa
                        : 'text-white/70 hover:text-white hover:bg-white/10' // Estilo padrão com hover
                    }`}
                    onClick={() => setIsOpen(false)} // Fecha menu mobile ao clicar em um link
                  >
                    {/* Renderiza o ícone dinamicamente */}
                    <link.icon size={20} />
                    {/* Texto do link */}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
 
          {/* ==============================
             BOTÃO DE LOGOUT (RODAPÉ)
             ============================== */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout} // Executa função de logout
              className="flex items-center space-x-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
 
      {/* ==============================
         OVERLAY ESCURO (MOBILE ONLY)
         ============================== */}
      {/* Aparece apenas quando o menu está aberto em mobile
          Permite fechar o menu clicando fora dele */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30" // Cobre toda a tela com fundo semi-transparente
          onClick={() => setIsOpen(false)} // Fecha menu ao clicar no overlay
        />
      )}
    </>
  );
};
 
/* ==============================
   EXPLICAÇÃO DO FUNCIONAMENTO:
   ==============================
   
   1. RESPONSIVIDADE:
      - Desktop: Sidebar sempre visível na lateral esquerda
      - Mobile: Sidebar escondida, acessível via botão hambúrguer
   
   2. ADAPTAÇÃO POR USUÁRIO:
      - Psicólogo: Vê links para Dashboard, Solicitações, Pacientes, etc.
      - Paciente: Vê apenas Dashboard e Solicitar Sessão
   
   3. ESTADOS VISUAIS:
      - Link ativo: Destacado com cor diferente
      - Hover: Efeitos visuais ao passar o mouse
      - Transições: Animações suaves para melhor UX
   
   4. ACESSIBILIDADE:
      - aria-label para leitores de tela
      - Navegação por teclado funcional
      - Contraste adequado de cores
   
   5. TECNOLOGIAS USADAS:
      - React Hooks (useState, useAuth, useNavigate, useLocation)
      - React Router (Link, navegação)
      - Tailwind CSS (estilização)
      - Lucide React (ícones)
   ============================== */
 