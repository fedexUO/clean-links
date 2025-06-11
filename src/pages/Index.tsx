import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Edit3, X, MoreVertical, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LinkCard from '../components/LinkCard';
import LinkEditor from '../components/LinkEditor';
import StyleEditor from '../components/StyleEditor';
import UserProfile from '../components/UserProfile';
import AvatarSelector from '../components/AvatarSelector';
import MissionsPanel from '../components/MissionsPanel';
import BackgroundSelector from '../components/BackgroundSelector';
import FontSelector from '../components/FontSelector';
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
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [title, setTitle] = useState('I MIEI LINK');
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [usernameInput, setUsernameInput] = useState('');
  const [currentBackground, setCurrentBackground] = useState(1);
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

    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
      setCurrentBackground(parseInt(savedBackground));
    }
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
        description: `Hai raggiunto il livello ${newLevel.toUpperCase()}! Hai sbloccato un nuovo outline!`,
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
    setTitle(newTitle.toUpperCase());
    localStorage.setItem('pageTitle', newTitle.toUpperCase());
  };

  const handleAvatarChange = (avatar: number) => {
    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        avatar,
        customAvatar: undefined // Rimuovi avatar personalizzato quando selezioni uno predefinito
      };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  const handleCustomAvatarChange = (customAvatarUrl: string) => {
    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        customAvatar: customAvatarUrl
      };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  const handleUsernameChange = () => {
    if (userProfile && usernameInput.trim()) {
      const updatedProfile = { ...userProfile, username: usernameInput.trim().toUpperCase() };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
      setShowUsernameEditor(false);
    }
  };

  const handleBackgroundChange = (background: number) => {
    setCurrentBackground(background);
    localStorage.setItem('selectedBackground', background.toString());
    setShowBackgroundSelector(false);
  };

  const openEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setShowLinkEditor(true);
  };

  const openStyleEditor = (link: LinkItem) => {
    setEditingLink(link);
    setShowStyleEditor(true);
  };

  const getBackgroundClass = () => {
    if (currentBackground === 999) {
      return 'bg-slate-50'; // Fallback for custom background
    }
    
    const backgrounds = [
      'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'
    ];
    return backgrounds[currentBackground - 1] || backgrounds[0];
  };

  const getBackgroundStyle = () => {
    if (currentBackground === 999) {
      const customBackground = localStorage.getItem('customBackground');
      if (customBackground) {
        return {
          backgroundImage: `url(${customBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    
    const styles = [
      {
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.25) 0%, transparent 60%)'
      }
    ];
    return styles[currentBackground - 1] || styles[0];
  };

  return (
    <>
      <div className={`min-h-screen ${getBackgroundClass()}`} style={getBackgroundStyle()}>
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
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
              <div className="flex-1 text-center">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-2xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl px-3 py-2 transition-all uppercase tracking-widest text-center"
                  placeholder="IL TUO TITOLO"
                />
                <p className="text-slate-600 mt-1 text-sm px-3 font-bold uppercase tracking-wider text-center">LA TUA COLLEZIONE PERSONALE DI LINK</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBackgroundSelector(true)}
                  className="bg-white/80 hover:bg-white/95 text-slate-700 p-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/50 super-circle"
                  title="CAMBIA SFONDO"
                >
                  <MoreVertical size={18} />
                </button>
                <button
                  onClick={() => setShowMissionsPanel(true)}
                  className="bg-purple-600/90 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-purple-500/50 super-circle"
                  title="MISSIONI"
                >
                  <Trophy size={18} />
                </button>
                <button
                  onClick={() => setShowLinkEditor(true)}
                  className="bg-blue-600/90 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-blue-500/50 super-circle"
                  title="AGGIUNGI LINK"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {links.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-100/50">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-black text-slate-700 mb-2 uppercase tracking-widest text-center">
                  NESSUN LINK ANCORA
                </h3>
                <p className="text-slate-500 mb-6 font-bold uppercase tracking-wider text-center">
                  INIZIA AGGIUNGENDO I TUOI SITI E STRUMENTI PREFERITI
                </p>
                <button
                  onClick={() => setShowLinkEditor(true)}
                  className="bg-blue-600/90 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-black transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm super-circle uppercase tracking-wider"
                >
                  AGGIUNGI IL PRIMO LINK
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            userLevel={userProfile?.level}
          />
        )}

        {showAvatarSelector && (
          <AvatarSelector
            currentAvatar={userProfile?.avatar || 1}
            onSelect={handleAvatarChange}
            onClose={() => setShowAvatarSelector(false)}
            customAvatar={userProfile?.customAvatar}
            onCustomAvatarSelect={handleCustomAvatarChange}
          />
        )}

        {showMissionsPanel && (
          <MissionsPanel
            missions={missions}
            onClose={() => setShowMissionsPanel(false)}
          />
        )}

        {showBackgroundSelector && (
          <BackgroundSelector
            currentBackground={currentBackground}
            onSelect={handleBackgroundChange}
            onClose={() => setShowBackgroundSelector(false)}
          />
        )}

        {/* Username Editor Modal */}
        {showUsernameEditor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-center">MODIFICA NOME</h2>
                <button
                  onClick={() => setShowUsernameEditor(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest text-center">
                    NOME UTENTE
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-slate-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm font-bold uppercase tracking-widest text-center"
                    placeholder="IL TUO NOME"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUsernameEditor(false)}
                    className="flex-1 px-4 py-3 text-slate-600 border border-slate-300/60 rounded-2xl hover:bg-slate-50/70 transition-all font-bold uppercase tracking-widest"
                  >
                    ANNULLA
                  </button>
                  <button
                    onClick={handleUsernameChange}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-bold uppercase tracking-widest"
                  >
                    SALVA
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;

</initial_code>
