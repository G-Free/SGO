import React, { useState } from 'react';
import logo from '../conteudo/imagem/Imagem1.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, User, Lock, Loader2, AlertTriangle } from 'lucide-react';


const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('O nome de utilizador ou a palavra-passe estão incorretos. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Branding Column */}
        <div 
            className="relative hidden lg:block"
        >
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop)'}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#002B7F] via-[#002266] to-[#001a4c] opacity-90"></div>

            <div className="relative flex flex-col justify-between h-full p-12 text-white">
                <div className="z-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-25 h-15 rounded-md  flex items-center justify-center">
                            <span className="text-xl font-black text-white"><img src={logo} alt="CGCF Logo" /></span>
                        </div>
                    </div>
                </div>
                <blockquote className="z-10 mt-4">
                  <p className="text-2xl font-bold tracking-tight leading-tight flex items-center justify-center">"A verdadeira segurança é fruto da prevenção inteligente e da coordenação eficaz."</p>
                  <footer className="mt-8 text-lg text-blue-200">Plataforma SGO (Sistema de Gestão de Operação)</footer>
                </blockquote>
                <p className="text-sm text-blue-300 z-10">&copy; 2025 Comité de Gestão Coordenada de Fronteiras.</p>
            </div>
        </div>

        {/* Right Form Column */}
        <div className="p-8 sm:p-16 flex flex-col justify-center">
            <div className="lg:hidden mb-8 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-md bg-blue-600/10 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-xl font-black text-blue-800 dark:text-white">CGCF</span>
                </div>
                <div>
                    <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">SGO</span>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Aceder à sua conta</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Bem-vindo! Por favor, insira as suas credenciais.
            </p>
            
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Utilizador</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 block w-full pl-10 p-3 sm:text-sm"
                      placeholder="Nome de utilizador"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Palavra-passe</label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password-input"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 block w-full pl-10 p-3 sm:text-sm"
                      placeholder="Palavra-passe"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300">Lembrar-me</label>
                </div>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Esqueceu a palavra-passe?</a>
              </div>

              {error && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium bg-red-100 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-500/30">
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0"/>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-md text-gray-900 bg-[#ffcd00] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-slate-800 transition-colors disabled:bg-yellow-300/50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                     <LogIn className="h-5 w-5 mr-2 -ml-2" aria-hidden="true" />
                     Entrar no Sistema
                    </>
                  )}
                </button>
              </div>
            </form>
             <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-10">
              Elaborado pela Equipa Técnica da Interoperabilidade dos Sistemas
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
