import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUserShield, faHistory, faExclamationTriangle, faSignOutAlt, faUserPlus, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

type ModificationLog = {
  id: number;
  action: string;
  date: string;
  user: string;
  details: string;
};

const generateLogs = (): ModificationLog[] => {
  return [
    { id: 1, action: 'Changement de mot de passe', date: '23/12/2023 14:30', user: 'Admin Principal', details: 'Mot de passe modifié avec succès' },
    { id: 2, action: 'Ajout administrateur', date: '20/12/2023 10:15', user: 'Admin Principal', details: 'Nouvel admin: marie.dupont@example.com' },
    { id: 3, action: 'Modification profil', date: '18/12/2023 16:45', user: 'Admin Principal', details: 'Nom et email mis à jour' },
    { id: 4, action: 'Changement de mot de passe', date: '15/12/2023 09:20', user: 'Admin Principal', details: 'Mot de passe modifié avec succès' },
    { id: 5, action: 'Suppression administrateur', date: '12/12/2023 11:30', user: 'Admin Principal', details: 'Admin supprimé: jean.martin@example.com' },
  ];
};

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Admin Principal',
    email: 'admin@example.com',
    phone: '+33 6 12 34 56 78',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });

  const logs = generateLogs();

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil mis à jour avec succès!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    toast.success('Mot de passe modifié avec succès!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Administrateur ${newAdmin.name} ajouté avec succès!`);
    setNewAdmin({ name: '', email: '', password: '' });
  };

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    // Logique de déconnexion ici
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Paramètres</h2>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            Informations du Profil
          </CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom Complet</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="text-purple-600" />
            Changer le Mot de Passe
          </CardTitle>
          <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Mot de passe actuel</Label>
              <Input
                id="current"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new">Nouveau mot de passe</Label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="border-gray-200 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Changer le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserShield} className="text-green-600" />
            Gestion des Administrateurs
          </CardTitle>
          <CardDescription>Ajoutez ou supprimez des comptes administrateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Ajouter un Administrateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel Administrateur</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte administrateur avec accès complet
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Nom</Label>
                  <Input
                    id="admin-name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe temporaire</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Créer l'administrateur</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Separator />

          <div>
            <h3 className="mb-4 font-semibold">Administrateurs actuels</h3>
            <div className="space-y-3">
              {[
                { name: 'Admin Principal', email: 'admin@example.com', role: 'Super Admin' },
                { name: 'Marie Dupont', email: 'marie.dupont@example.com', role: 'Admin' },
                { name: 'Pierre Martin', email: 'pierre.martin@example.com', role: 'Admin' },
              ].map((admin, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div>
                    <p className="font-medium group-hover:text-blue-600 transition-colors">{admin.name}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium">{admin.role}</span>
                    {index !== 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.success(`Admin ${admin.name} supprimé`)}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-orange-600" />
            Historique des Modifications
          </CardTitle>
          <CardDescription>Détails des dernières actions effectuées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-orange-50/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.action}</span>
                  </div>
                  <p className="text-sm text-gray-500">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Par: {log.user}</span>
                    <span>•</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-gradient-to-r from-red-50/50 to-white backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Zone de Danger
          </CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Se Déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}