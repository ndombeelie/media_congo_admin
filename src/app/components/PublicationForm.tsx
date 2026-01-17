import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRotateLeft, faFileAlt, faImage, faLink, faAd } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { apiService } from '@/services/api';
import { useEffect } from 'react';

export default function PublicationForm() {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    youtube: '',
    facebook: '',
    tiktok: '',
    instagram: '',
  });
  const [adContent, setAdContent] = useState('');

  const [user, setUser] = useState<any>(null);
  const [activeType, setActiveType] = useState('text');
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  const loadPosts = async () => {
    const data = await apiService.fetchPosts();
    setRecentPosts(data.slice(0, 5));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    loadPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('type', activeType);

      if (activeType === 'ad') {
        formData.append('content', adContent);
      } else {
        formData.append('content', content);
      }

      if (activeType === 'media' && mediaFiles && mediaFiles.length > 0) {
        formData.append('media', mediaFiles[0]);
      }

      if (activeType === 'links') {
        const videoLink = socialLinks.youtube || socialLinks.facebook || socialLinks.tiktok || socialLinks.instagram;
        if (videoLink) formData.append('videoLink', videoLink);
      }

      await apiService.createPost(formData);
      toast.success('Publication créée avec succès!');
      loadPosts();

      // Reset form
      setContent('');
      setMediaFiles(null);
      setSocialLinks({ youtube: '', facebook: '', tiktok: '', instagram: '' });
      setAdContent('');
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Créer une Publication</h2>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Nouvelle Publication
          </CardTitle>
          <CardDescription>Créez et publiez du contenu sur votre plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeType} onValueChange={setActiveType} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-50/80 backdrop-blur-sm p-1">
                <TabsTrigger value="text">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Texte
                </TabsTrigger>
                <TabsTrigger value="media">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Médias
                </TabsTrigger>
                <TabsTrigger value="links">
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  Liens Sociaux
                </TabsTrigger>
                <TabsTrigger value="ad">
                  <FontAwesomeIcon icon={faAd} className="mr-2" />
                  Publicité
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu de la Publication</Label>
                  <Textarea
                    id="content"
                    placeholder="Écrivez votre publication ici..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">{content.length} caractères</p>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="media">Télécharger Images et Vidéos</Label>
                  <Input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => setMediaFiles(e.target.files)}
                  />
                  {mediaFiles && mediaFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">{mediaFiles.length} fichier(s) sélectionné(s):</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {Array.from(mediaFiles).map((file, index) => (
                          <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="links" className="space-y-4 mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Ajoutez des liens de réseaux sociaux pour scraper le contenu automatiquement
                </p>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faYoutube} className="text-red-600" />
                    Lien YouTube
                  </Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
                    Lien Facebook
                  </Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTiktok} className="text-gray-800" />
                    Lien TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    value={socialLinks.tiktok}
                    onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faInstagram} className="text-pink-600" />
                    Lien Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/p/..."
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="ad" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="ad">Contenu Publicitaire</Label>
                  <Textarea
                    id="ad"
                    placeholder="Ajoutez votre contenu publicitaire ici..."
                    value={adContent}
                    onChange={(e) => setAdContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    Ce contenu sera affiché comme publicité dans votre publication
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Publier
              </Button>
              <Button type="button" variant="outline" className="hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg" onClick={() => {
                setContent('');
                setMediaFiles(null);
                setSocialLinks({ youtube: '', facebook: '', tiktok: '', instagram: '' });
                setAdContent('');
              }}>
                <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
                Réinitialiser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Publications Récentes
          </CardTitle>
          <CardDescription>Dernières publications créées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((pub) => (
              <div key={pub.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50/50 hover:shadow-lg transition-all duration-300 hover:scale-102 hover:-translate-y-1 group">
                <div className="flex-1">
                  <p className="font-medium group-hover:text-blue-600 transition-colors line-clamp-1">{pub.content}</p>
                  <p className="text-sm text-gray-400 mt-1">{new Date(pub.timestamp).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">{pub.type}</p>
                  <p className="text-xs text-gray-500">{pub.views} vues</p>
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucune publication récente.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}