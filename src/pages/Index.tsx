
import React, { useState, useEffect } from 'react';
import { Plus, Settings, ExternalLink } from 'lucide-react';
import LinkCard from '../components/LinkCard';
import LinkEditor from '../components/LinkEditor';
import StyleEditor from '../components/StyleEditor';
import { LinkItem, loadLinks, saveLinks } from '../utils/linkStorage';

const Index = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [title, setTitle] = useState('I Miei Link');

  useEffect(() => {
    const savedLinks = loadLinks();
    setLinks(savedLinks);
    
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  const handleAddLink = (newLink: Omit<LinkItem, 'id'>) => {
    const linkWithId: LinkItem = {
      ...newLink,
      id: Date.now().toString(),
    };
    const updatedLinks = [...links, linkWithId];
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    setShowLinkEditor(false);
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
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    localStorage.setItem('pageTitle', newTitle);
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
          <div className="flex items-center justify-between">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-3xl font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all"
                placeholder="Il tuo titolo"
              />
              <p className="text-slate-600 mt-2">La tua collezione personale di link</p>
            </div>
            <button
              onClick={() => setShowLinkEditor(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Aggiungi Link
            </button>
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
    </div>
  );
};

export default Index;
