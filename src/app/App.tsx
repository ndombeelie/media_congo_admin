import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileAlt, faEye, faFileDownload, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './components/fontawesome-config';
import Dashboard from './components/Dashboard';
import PublicationForm from './components/PublicationForm';
import ViewsList from './components/ViewsList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import AuthPage from './components/AuthPage';
import { Toaster, toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from './components/ui/button';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Déconnecté du panneau d\'administration');
  };

  if (loading) return null;

  if (!user || user.role !== 'admin') {
    return (
      <>
        <AuthPage onLoginSuccess={setUser} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto p-6">
        <header className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-3xl -z-10"></div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Panneau d'Administration
              </h1>
              <p className="text-gray-600">Bienvenue, {user.username} 👋</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-800">{user.username}</p>
                  <p className="text-xs text-primary font-medium">{user.role.toUpperCase()}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 shadow-sm"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 p-1">
            <TabsTrigger value="dashboard">
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="publications">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="views">
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              Vues
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
              Rapports
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="publications">
            <PublicationForm />
          </TabsContent>

          <TabsContent value="views">
            <ViewsList />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}