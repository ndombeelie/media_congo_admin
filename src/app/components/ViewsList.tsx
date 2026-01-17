import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faServer, faClock, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import StatCard from './StatCard';
import { apiService } from '@/services/api';

type View = {
  id: number;
  publicationTitle: string;
  ipAddress: string;
  timestamp: string;
  duration: number;
  device: string;
};

export default function ViewsList() {
  const [views, setViews] = useState<View[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDevice, setFilterDevice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadViews = async () => {
      setIsLoading(true);
      const data = await apiService.fetchViews();
      setViews(data);
      setIsLoading(false);
    };
    loadViews();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Chargement des vues...</div>;
  }

  const filteredViews = views.filter(view => {
    const matchesSearch =
      view.publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.ipAddress.includes(searchTerm);
    const matchesDevice = filterDevice === 'all' || view.device === filterDevice;
    return matchesSearch && matchesDevice;
  });

  const totalPages = Math.ceil(filteredViews.length / itemsPerPage);
  const paginatedViews = filteredViews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const uniqueIPs = new Set(views.map(v => v.ipAddress)).size;
  const totalDuration = views.reduce((sum, v) => sum + v.duration, 0);
  const avgDuration = Math.floor(totalDuration / views.length);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Liste des Vues</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total des Vues"
          value={views.length}
          description="Streaming en temps réel"
          icon={faEye}
          iconColor="text-blue-500"
        />

        <StatCard
          title="Adresses IP Uniques"
          value={uniqueIPs}
          description="1 vue par IP par publication"
          icon={faServer}
          iconColor="text-green-500"
        />

        <StatCard
          title="Durée Moyenne"
          value={`${avgDuration}s`}
          description="Temps de lecture moyen"
          icon={faClock}
          iconColor="text-purple-500"
        />
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Historique des Vues
          </CardTitle>
          <CardDescription>Liste complète de toutes les vues par publication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher par publication ou IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="w-[200px] border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  <SelectValue placeholder="Filtrer par appareil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les appareils</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-gray-100 hover:to-blue-50/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Publication</TableHead>
                    <TableHead className="font-semibold">Adresse IP</TableHead>
                    <TableHead className="font-semibold">Date/Heure</TableHead>
                    <TableHead className="font-semibold">Durée</TableHead>
                    <TableHead className="font-semibold">Appareil</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedViews.map((view) => (
                    <TableRow key={view.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="font-medium">{view.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{view.publicationTitle}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg border border-blue-100 font-mono">{view.ipAddress}</code>
                      </TableCell>
                      <TableCell className="text-sm">{view.timestamp}</TableCell>
                      <TableCell className="font-medium text-blue-600">{view.duration}s</TableCell>
                      <TableCell>
                        <Badge variant={
                          view.device === 'Desktop' ? 'default' :
                            view.device === 'Mobile' ? 'secondary' :
                              'outline'
                        } className="shadow-sm">
                          {view.device}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">
                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredViews.length)} sur {filteredViews.length} vues
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105 font-medium"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm font-medium">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105 font-medium"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}