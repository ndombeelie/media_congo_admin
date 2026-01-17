import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faChevronRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface AuthPageProps {
    onLoginSuccess: (user: any) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiService.login({ email, password });

            if (response.user.role !== 'admin') {
                toast.error("Accès refusé. Vous n'êtes pas administrateur.");
                return;
            }

            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            toast.success('Bienvenue, ' + response.user.username);
            onLoginSuccess(response.user);
        } catch (error: any) {
            toast.error(error.message || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

            <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border-white/20 scale-100 hover:scale-[1.01] transition-all duration-300">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <FontAwesomeIcon icon={faLock} className="text-white text-2xl" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Média Pro
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Connectez-vous pour gérer votre plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email professionnel</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder=""
                                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-500 transition-colors"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? "Chargement..." : "Accéder au Panneau"}
                            {!loading && <FontAwesomeIcon icon={faChevronRight} className="ml-2" />}
                        </Button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 italic">
                            Système sécurisé • Média Pro &copy; 2024
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
