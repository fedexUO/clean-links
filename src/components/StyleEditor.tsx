
import React, { useState } from 'react';
import { Palette, X, ChevronDown, Plus } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';
import { UserProfile } from '../utils/userProfile';

interface StyleEditorProps {
  link: LinkItem;
  onSave: (style: LinkItem['style']) => void;
  onClose: () => void;
  userLevel?: UserProfile['level'];
}

const StyleEditor: React.FC<StyleEditorProps> = ({ link, onSave, onClose }) => {
  const [style, setStyle] = useState(link.style);
  const [expandedSection, setExpandedSection] = useState<string | null>('color');
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);

  const predefinedColors = [
    // Neutri
    '#64748B', '#374151', '#1F2937', '#111827',
    // Brand comuni  
    '#3B82F6', '#10B981', '#EF4444', '#F59E0B',
    // Creativi
    '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'
  ];

  const borderStyles = [
    { value: 'solid', label: 'SOLIDO' },
    { value: 'dashed', label: 'TRATTEGGIATO' },
    { value: 'dotted', label: 'PUNTINATO' },
    { value: 'oro-colante', label: '🔥 ORO' },
    { value: 'argento-colante', label: '❄️ ARGENTO' },
    { value: 'bronzo-colante', label: '🟤 BRONZO' },
    { value: 'diamanti-luccicanti', label: '💎 DIAMANTE' },
  ] as const;

  const borderWidthPresets = [1, 2, 4, 6, 8];

  const updateStyle = (field: keyof LinkItem['style'], value: any) => {
    const newStyle = { ...style, [field]: value };
    setStyle(newStyle);
    onSave(newStyle);
  };

  const getBorderClass = (borderType: string) => {
    const effectClasses = {
      'oro-colante': 'oro-colante',
      'argento-colante': 'argento-colante',
      'bronzo-colante': 'bronzo-colante',
      'lava-colante': 'lava-colante',
      'diamanti-luccicanti': 'diamanti-luccicanti',
      'lego-border': 'lego-border'
    };
    return effectClasses[borderType as keyof typeof effectClasses] || '';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ title, isExpanded, onClick }: { title: string; isExpanded: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl transition-all duration-150 group"
    >
      <span className="text-sm font-medium text-slate-700 uppercase tracking-wide">{title}</span>
      <ChevronDown 
        size={16} 
        className={`text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-xl border border-white/20 max-h-[85vh] overflow-hidden">
        {/* Header compatto */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100/70 rounded-lg">
              <Palette className="text-purple-600" size={16} />
            </div>
            <h2 className="text-base font-medium text-slate-800 uppercase tracking-wide">Personalizza Stile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100/70 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Anteprima compatta sempre visibile */}
          <div className="p-4 border-b border-slate-100/50">
            <div
              className={`bg-white/90 p-3 rounded-lg transition-all duration-200 ${getBorderClass(style.borderStyle)}`}
              style={{
                borderWidth: `${style.borderWidth}px`,
                borderColor: style.borderColor,
                borderStyle: borderStyles.find(b => b.value === style.borderStyle)?.value.includes('-') ? 'solid' : style.borderStyle,
              }}
            >
              <h3 className="font-semibold text-slate-800 text-sm text-center">{link.name}</h3>
              <p className="text-slate-500 text-xs mt-1 text-center truncate">{link.description || link.url}</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Sezione Colore */}
            <div>
              <SectionHeader 
                title="Colore Bordo" 
                isExpanded={expandedSection === 'color'} 
                onClick={() => toggleSection('color')} 
              />
              {expandedSection === 'color' && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateStyle('borderColor', color)}
                        className={`w-full aspect-square rounded-md border-2 transition-all duration-150 hover:scale-105 ${
                          style.borderColor === color ? 'border-slate-700 ring-2 ring-slate-300/50' : 'border-white shadow-sm'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                    className="w-full p-2 border-2 border-dashed border-slate-300 rounded-md hover:border-slate-400 transition-colors duration-150 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700"
                  >
                    <Plus size={16} />
                    <span className="text-sm font-medium">Colore Custom</span>
                  </button>
                  {showCustomColorPicker && (
                    <input
                      type="color"
                      value={style.borderColor}
                      onChange={(e) => updateStyle('borderColor', e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-200 cursor-pointer"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Sezione Spessore */}
            <div>
              <SectionHeader 
                title={`Spessore: ${style.borderWidth}px`}
                isExpanded={expandedSection === 'width'} 
                onClick={() => toggleSection('width')} 
              />
              {expandedSection === 'width' && (
                <div className="mt-3">
                  <div className="flex justify-between gap-2">
                    {borderWidthPresets.map((width) => (
                      <button
                        key={width}
                        onClick={() => updateStyle('borderWidth', width)}
                        className={`flex-1 p-2 rounded-lg border transition-all duration-150 hover:scale-105 ${
                          style.borderWidth === width 
                            ? 'border-blue-500 bg-blue-50/70 text-blue-700' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{width}px</div>
                        <div 
                          className="w-full bg-current mt-1 rounded-sm" 
                          style={{ height: `${Math.max(width, 2)}px` }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sezione Stile */}
            <div>
              <SectionHeader 
                title="Stile Bordo" 
                isExpanded={expandedSection === 'style'} 
                onClick={() => toggleSection('style')} 
              />
              {expandedSection === 'style' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {borderStyles.map((borderStyle) => (
                    <button
                      key={borderStyle.value}
                      type="button"
                      onClick={() => updateStyle('borderStyle', borderStyle.value)}
                      className={`p-3 rounded-lg border transition-all duration-150 hover:scale-[1.02] ${
                        style.borderStyle === borderStyle.value
                          ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white/50'
                      }`}
                    >
                      <div className="text-xs font-medium mb-2 text-center">{borderStyle.label}</div>
                      <div 
                        className={`w-full h-3 bg-slate-400 transition-all ${
                          borderStyle.value.includes('-') ? getBorderClass(borderStyle.value) : ''
                        }`}
                        style={{ 
                          borderStyle: borderStyle.value.includes('-') ? 'solid' : borderStyle.value, 
                          borderWidth: '2px', 
                          borderColor: borderStyle.value.includes('-') ? 'transparent' : '#64748b',
                          height: borderStyle.value.includes('-') ? '12px' : '8px'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
