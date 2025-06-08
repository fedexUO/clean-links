
import React, { useState, useEffect } from 'react';
import { Plus, Settings, ExternalLink, Trophy, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LinkCard from '../components/LinkCard';
import LinkEditor from '../components/LinkEditor';
import StyleEditor from '../components/StyleEditor';
import UserProfile from '../components/UserProfile';
import AvatarSelector from '../components/AvatarSelector';
import MissionsPanel from '../components/MissionsPanel';
import { LinkItem, loadLinks, saveLinks } from '../utils/linkStorage';
import { 
  UserProfile as UserProfileType, 
  Mission,
  loadUserProfile, 
  saveUserProfile, 
  loadMissions, 
  saveMissions,
  calculateLevel
} from '../utils/userProfile';

const Index = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showMissionsPanel, setShowMissionsPanel] = useState(false);
  const [showUsernameEditor, setShowUsernameEditor] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [title, setTitle] = useState('I Miei Link');
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [usernameInput, setUsernameInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedLinks = loadLinks();
    setLinks(savedLinks);
    
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedTitle) {
      setTitle(savedTitle);
    }

    const profile = loadUserProfile();
    setUserProfile(profile);
    setUsernameInput(profile.username);

    const savedMissions = loadMissions();
    setMissions(savedMissions);
  }, []);

  const updateMissionProgress = (
    profile: UserProfileType, 
    missions: Mission[], 
    actionType: 'link_added' | 'style_modified' | 'description_added' | 'color_used'
  ) => {
    const updatedMissions = [...missions];
    let xpGained = 0;
    
    updatedMissions.forEach(mission => {
      if (mission.completed) return;
      
      let newProgress = mission.progress;
      
      switch (mission.type) {
        case 'links':
          if (actionType === 'link_added') {
            newProgress = profile.stats.linksCreated;
          }
          break;
        case 'login':
          newProgress = profile.consecutiveLogins;
          break;
        case 'style':
          if (actionType === 'style_modified') {
            newProgress = profile.stats.stylesModified;
          }
          break;
        case 'description':
          if (actionType === 'description_added') {
            newProgress = profile.stats.linksWithDescription;
          }
          break;
        case 'colors':
          if (actionType === 'color_used') {
            newProgress = profile.stats.uniqueBorderColors.length;
          }
          break;
      }
      
      mission.progress = Math.min(newProgress, mission.target);
      
      if (!mission.completed && mission.progress >= mission.target) {
        mission.completed = true;
        xpGained += mission.reward;
        
        toast({
          title: "Missione Completata! 🎉",
          description: `${mission.name} - Hai guadagnato ${mission.reward} XP`,
        });
      }
    });
    
    return { updatedMissions, xpGained };
  };

  const checkLevelUp = (oldLevel: UserProfileType['level'], newLevel: UserProfileType['level']) => {
    if (oldLevel !== newLevel) {
      toast({
        title: "Level Up! 🚀",
        description: `Hai raggiunto il livello ${newLevel.toUpperCase()}!`,
      });
    }
  };

  const handleAddLink = (newLink: Omit<LinkItem, 'id'>) => {
    const linkWithId: LinkItem = {
      ...newLink,
      id: Date.now().toString(),
    };
    const updatedLinks = [...links, linkWithId];
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    setShowLinkEditor(false);

    // Aggiorna profilo e missioni
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        stats: {
          ...userProfile.stats,
          linksCreated: userProfile.stats.linksCreated + 1,
          linksWithDescription: newLink.description ? userProfile.stats.linksWithDescription + 1 : userProfile.stats.linksWithDescription,
          uniqueBorderColors: userProfile.stats.uniqueBorderColors.includes(newLink.style.borderColor) 
            ? userProfile.stats.uniqueBorderColors 
            : [...userProfile.stats.uniqueBorderColors, newLink.style.borderColor]
        }
      };

      const { updatedMissions, xpGained } = updateMissionProgress(
        updatedProfile, 
        missions, 
        newLink.description ? 'description_added' : 'link_added'
      );

      updatedProfile.xp += xpGained;
      const oldLevel = updatedProfile.level;
      updatedProfile.level = calculateLevel(updatedProfile.xp);
      
      setUserProfile(updatedProfile);
      setMissions(updatedMissions);
      saveUserProfile(updatedProfile);
      saveMissions(updatedMissions);
      
      checkLevelUp(oldLevel, updatedProfile.level);
    }
  };

  const handleEditLink = (updatedLink: LinkItem) => {
    const updatedLinks = links.map(link => 
      link.id === updatedLink.id ? updatedLink : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    setEditingLink(null);
    setShowLinkEditor(false);
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const handleUpdateLinkStyle = (id: string, style: LinkItem['style']) => {
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, style } : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);

    // Aggiorna statistiche per stili modificati
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        stats: {
          ...userProfile.stats,
          stylesModified: userProfile.stats.stylesModified + 1,
          uniqueBorderColors: userProfile.stats.uniqueBorderColors.includes(style.borderColor) 
            ? userProfile.stats.uniqueBorderColors 
            : [...userProfile.stats.uniqueBorderColors, style.borderColor]
        }
      };

      const { updatedMissions, xpGained } = updateMissionProgress(
        updatedProfile, 
        missions, 
        'style_modified'
      );

      updatedProfile.xp += xpGained;
      const oldLevel = updatedProfile.level;
      updatedProfile.level = calculateLevel(updatedProfile.xp);
      
      setUserProfile(updatedProfile);
      setMissions(updatedMissions);
      saveUserProfile(updatedProfile);
      saveMissions(updatedMissions);
      
      checkLevelUp(oldLevel, updatedProfile.level);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    localStorage.setItem('pageTitle', newTitle);
  };

  const handleAvatarChange = (avatar: number) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, avatar };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  const handleUsernameChange = () => {
    if (userProfile && usernameInput.trim()) {
      const updatedProfile = { ...userProfile, username: usernameInput.trim() };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
      setShowUsernameEditor(false);
    }
  };

  const openEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setShowLinkEditor(true);
  };

  const openStyleEditor = (link: LinkItem) => {
    setEditingLink(link);
    setShowStyleEditor(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* User Profile Section */}
          {userProfile && (
            <div className="mb-6">
              <UserProfile
                profile={userProfile}
                onEditAvatar={() => setShowAvatarSelector(true)}
                onEditUsername={() => setShowUsernameEditor(true)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-3xl font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all"
                placeholder="Il tuo titolo"
              />
              <p className="text-slate-600 mt-2">La tua collezione personale di link</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowMissionsPanel(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Trophy size={20} />
                Missioni
              </button>
              <button
                onClick={() => setShowLinkEditor(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus size={20} />
                Aggiungi Link
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {links.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <ExternalLink size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nessun link ancora
              </h3>
              <p className="text-slate-500 mb-6">
                Inizia aggiungendo i tuoi siti e strumenti preferiti
              </p>
              <button
                onClick={() => setShowLinkEditor(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Aggiungi il primo link
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={() => openEditLink(link)}
                onDelete={() => handleDeleteLink(link.id)}
                onStyleEdit={() => openStyleEditor(link)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showLinkEditor && (
        <LinkEditor
          link={editingLink}
          onSave={editingLink ? handleEditLink : handleAddLink}
          onClose={() => {
            setShowLinkEditor(false);
            setEditingLink(null);
          }}
        />
      )}

      {showStyleEditor && editingLink && (
        <StyleEditor
          link={editingLink}
          onSave={(style) => handleUpdateLinkStyle(editingLink.id, style)}
          onClose={() => {
            setShowStyleEditor(false);
            setEditingLink(null);
          }}
        />
      )}

      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={userProfile?.avatar || 1}
          onSelect={handleAvatarChange}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

      {showMissionsPanel && (
        <MissionsPanel
          missions={missions}
          onClose={() => setShowMissionsPanel(false)}
        />
      )}

      {/* Username Editor Modal */}
      {showUsernameEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Modifica Nome</h2>
              <button
                onClick={() => setShowUsernameEditor(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome utente
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Il tuo nome"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUsernameEditor(false)}
                  className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleUsernameChange}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
