import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { apiService } from '@/services/api';
import { useEffect } from 'react';

type ReportData = {
  publication: string;
  vues: number;
  likes: number;
  commentaires: number;
  partages: number;
  engagement: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const posts = await apiService.fetchPosts();
      const formattedData: ReportData[] = posts.map((post: any) => ({
        publication: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
        vues: post.views,
        likes: post.likes,
        commentaires: post.commentsCount,
        partages: Math.floor(post.views * 0.05), // Simulation 5%
        engagement: post.views > 0
          ? ((post.likes + post.commentsCount) / post.views * 100).toFixed(1) + '%'
          : '0%'
      }));
      setData(formattedData);
      setIsLoading(false);
    };
    loadData();
  }, [period]);

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des rapports...</div>;
  }

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.text('Rapport Général des Publications', 14, 20);

    // Date
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Période: ${period === 'daily' ? 'Quotidien' : period === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}`, 14, 37);

    // Tableau
    autoTable(doc, {
      startY: 45,
      head: [['Publication', 'Vues', 'Likes', 'Commentaires', 'Partages', 'Engagement']],
      body: data.map(row => [
        row.publication,
        row.vues.toString(),
        row.likes.toString(),
        row.commentaires.toString(),
        row.partages.toString(),
        row.engagement
      ]),
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Statistiques totales
    const finalY = (doc as any).lastAutoTable.finalY || 45;
    doc.setFontSize(12);
    doc.text('Statistiques Totales:', 14, finalY + 15);

    const totals = {
      vues: data.reduce((sum, row) => sum + row.vues, 0),
      likes: data.reduce((sum, row) => sum + row.likes, 0),
      commentaires: data.reduce((sum, row) => sum + row.commentaires, 0),
      partages: data.reduce((sum, row) => sum + row.partages, 0),
    };

    doc.setFontSize(10);
    doc.text(`Total Vues: ${totals.vues.toLocaleString()}`, 14, finalY + 25);
    doc.text(`Total Likes: ${totals.likes.toLocaleString()}`, 14, finalY + 32);
    doc.text(`Total Commentaires: ${totals.commentaires.toLocaleString()}`, 14, finalY + 39);
    doc.text(`Total Partages: ${totals.partages.toLocaleString()}`, 14, finalY + 46);

    doc.save(`rapport-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Rapport PDF téléchargé avec succès!');
  };

  const exportToCSV = () => {
    const headers = ['Publication', 'Vues', 'Likes', 'Commentaires', 'Partages', 'Engagement'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.publication}"`,
        row.vues,
        row.likes,
        row.commentaires,
        row.partages,
        row.engagement
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Rapport CSV téléchargé avec succès!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Rapports Généraux</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Quotidien</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📥</span>
            Export des Rapports
          </CardTitle>
          <CardDescription>Téléchargez vos statistiques au format PDF ou CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={exportToPDF} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
              Exporter en PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline" className="flex-1 hover:bg-green-50 hover:border-green-500 hover:text-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
              Exporter en CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Aperçu du Rapport
          </CardTitle>
          <CardDescription>Vue d'ensemble des données incluses dans le rapport</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Publication</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Vues</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Likes</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Commentaires</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Partages</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm">{row.publication}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-blue-600">{row.vues.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm">{row.likes}</td>
                    <td className="px-4 py-3 text-right text-sm">{row.commentaires}</td>
                    <td className="px-4 py-3 text-right text-sm">{row.partages}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-purple-600">{row.engagement}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-50 to-purple-50/30">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">
                    {data.reduce((sum, row) => sum + row.vues, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {data.reduce((sum, row) => sum + row.likes, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {data.reduce((sum, row) => sum + row.commentaires, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {data.reduce((sum, row) => sum + row.partages, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
              Métriques Clés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50/30 rounded-lg">
              <span className="text-sm text-gray-600">Nombre de publications:</span>
              <span className="font-semibold text-blue-600">{data.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50/30 rounded-lg">
              <span className="text-sm text-gray-600">Total des vues:</span>
              <span className="font-semibold text-blue-600">{data.reduce((sum, row) => sum + row.vues, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50/30 rounded-lg">
              <span className="text-sm text-gray-600">Moyenne vues/publication:</span>
              <span className="font-semibold text-blue-600">{Math.floor(data.reduce((sum, row) => sum + row.vues, 0) / data.length)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50/30 rounded-lg">
              <span className="text-sm text-gray-600">Taux d'engagement moyen:</span>
              <span className="font-semibold text-purple-600">23.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
              Top Performances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
              <p className="text-sm text-gray-600 mb-1">🏆 Plus de vues:</p>
              <p className="text-sm font-medium">
                {data.reduce((prev, current) => (prev.vues > current.vues) ? prev : current).publication}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
              <p className="text-sm text-gray-600 mb-1">❤️ Plus de likes:</p>
              <p className="text-sm font-medium">
                {data.reduce((prev, current) => (prev.likes > current.likes) ? prev : current).publication}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">💬 Plus de commentaires:</p>
              <p className="text-sm font-medium">
                {data.reduce((prev, current) => (prev.commentaires > current.commentaires) ? prev : current).publication}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}