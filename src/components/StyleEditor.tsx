
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
  const [showAdvancedStyles, setShowAdvancedStyles] = useState(false);

  const predefinedColors = [
    // Neutri
    '#64748B', '#374151', '#1F2937', '#111827',
    // Brand comuni  
    '#3B82F6', '#10B981', '#EF4444', '#F59E0B',
    // Creativi
    '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'
  ];

  const colorNames: { [key: string]: string } = {
    '#64748B': 'Grigio',
    '#374151': 'Antracite',
    '#1F2937': 'Carbone',
    '#111827': 'Nero',
    '#3B82F6': 'Blu',
    '#10B981': 'Verde',
    '#EF4444': 'Rosso',
    '#F59E0B': 'Arancione',
    '#8B5CF6': 'Viola',
    '#EC4899': 'Rosa',
    '#F97316': 'Mandarino',
    '#06B6D4': 'Ciano'
  };

  const basicBorderStyles = [
    { value: 'solid', label: 'Solido' },
    { value: 'dashed', label: 'Tratteggiato' },
    { value: 'dotted', label: 'Puntinato' },
    { value: 'double', label: 'Doppio' },
  ] as const;

  const advancedBorderStyles = [
    { value: 'oro-colante', label: '🔥 Oro' },
    { value: 'argento-colante', label: '❄️ Argento' },
    { value: 'bronzo-colante', label: '🟤 Bronzo' },
    { value: 'diamanti-luccicanti', label: '💎 Diamante' },
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

  const SectionHeader = ({ title, isExpanded, onClick, indicator }: { 
    title: string; 
    isExpanded: boolean; 
    onClick: () => void;
    indicator?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl transition-all duration-150 group"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {!isExpanded && indicator && (
          <div className="flex items-center gap-1">
            {indicator}
          </div>
        )}
      </div>
      <ChevronDown 
        size={16} 
        className={`text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-sm shadow-xl border border-white/20 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100/70 rounded-lg">
              <Palette className="text-purple-600" size={14} />
            </div>
            <h2 className="text-sm font-medium text-slate-800">Personalizza stile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100/70 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
          {/* Anteprima */}
          <div className="p-3 border-b border-slate-100/50">
            <div
              className={`bg-white/90 p-2.5 rounded-lg transition-all duration-200 ${getBorderClass(style.borderStyle)}`}
              style={{
                borderWidth: `${style.borderWidth}px`,
                borderColor: style.borderColor,
                borderStyle: [...basicBorderStyles, ...advancedBorderStyles].find(b => b.value === style.borderStyle)?.value.includes('-') ? 'solid' : style.borderStyle,
              }}
            >
              <h3 className="font-semibold text-slate-800 text-xs text-center">{link.name}</h3>
              <p className="text-slate-500 text-xs mt-1 text-center truncate">{link.description || link.url}</p>
            </div>
          </div>

          <div className="p-3 space-y-2.5">
            {/* Sezione Colore */}
            <div>
              <SectionHeader 
                title="Colore bordo" 
                isExpanded={expandedSection === 'color'} 
                onClick={() => toggleSection('color')}
                indicator={
                  <div 
                    className="w-3 h-3 rounded border border-white/50 shadow-sm"
                    style={{ backgroundColor: style.borderColor }}
                  />
                }
              />
              {expandedSection === 'color' && (
                <div className="mt-2.5 space-y-2.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {predefinedColors.map((color) => (
                      <div key={color} className="relative group">
                        <button
                          onClick={() => updateStyle('borderColor', color)}
                          className={`w-full aspect-square rounded-lg border-2 transition-all duration-150 hover:scale-105 ${
                            style.borderColor === color 
                              ? 'border-slate-600 ring-2 ring-slate-300/50' 
                              : 'border-white/50 shadow-sm hover:border-slate-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={colorNames[color] || color}
                        />
                        {style.borderColor === color && (
                          <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500/30 pointer-events-none" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                    className="w-full p-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-150 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700"
                  >
                    <Plus size={14} />
                    <span className="text-xs font-medium">Personalizzato</span>
                  </button>
                  {showCustomColorPicker && (
                    <input
                      type="color"
                      value={style.borderColor}
                      onChange={(e) => updateStyle('borderColor', e.target.value)}
                      className="w-full h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Sezione Spessore */}
            <div>
              <SectionHeader 
                title="Spessore" 
                isExpanded={expandedSection === 'width'} 
                onClick={() => toggleSection('width')}
                indicator={
                  <span className="text-xs text-slate-500 font-medium">{style.borderWidth}px</span>
                }
              />
              {expandedSection === 'width' && (
                <div className="mt-2.5">
                  <div className="flex justify-between gap-1.5">
                    {borderWidthPresets.map((width) => (
                      <button
                        key={width}
                        onClick={() => updateStyle('borderWidth', width)}
                        className={`flex-1 p-2 rounded-lg border transition-all duration-150 hover:scale-105 ${
                          style.borderWidth === width 
                            ? 'border-blue-500 bg-blue-50/70 text-blue-700 ring-2 ring-blue-200/50' 
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
                title="Stile bordo" 
                isExpanded={expandedSection === 'style'} 
                onClick={() => toggleSection('style')}
                indicator={
                  <span className="text-xs text-slate-500 font-medium capitalize">
                    {basicBorderStyles.find(s => s.value === style.borderStyle)?.label || 
                     advancedBorderStyles.find(s => s.value === style.borderStyle)?.label || 
                     'Personalizzato'}
                  </span>
                }
              />
              {expandedSection === 'style' && (
                <div className="mt-2.5 space-y-2.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {basicBorderStyles.map((borderStyle) => (
                      <button
                        key={borderStyle.value}
                        type="button"
                        onClick={() => updateStyle('borderStyle', borderStyle.value)}
                        className={`p-2.5 rounded-lg border transition-all duration-150 hover:scale-[1.02] ${
                          style.borderStyle === borderStyle.value
                            ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-sm ring-2 ring-blue-200/50'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white/50'
                        }`}
                      >
                        <div className="text-xs font-medium mb-1.5 text-center">{borderStyle.label}</div>
                        <div 
                          className="w-full h-2"
                          style={{ 
                            borderStyle: borderStyle.value, 
                            borderWidth: '1px', 
                            borderColor: style.borderColor,
                            backgroundColor: 'transparent'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowAdvancedStyles(!showAdvancedStyles)}
                    className="w-full p-2 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors duration-150 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700"
                  >
                    <span className="text-xs font-medium">Stili avanzati</span>
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${showAdvancedStyles ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {showAdvancedStyles && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {advancedBorderStyles.map((borderStyle) => (
                        <button
                          key={borderStyle.value}
                          type="button"
                          onClick={() => updateStyle('borderStyle', borderStyle.value)}
                          className={`p-2.5 rounded-lg border transition-all duration-150 hover:scale-[1.02] ${
                            style.borderStyle === borderStyle.value
                              ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-sm ring-2 ring-blue-200/50'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white/50'
                          }`}
                        >
                          <div className="text-xs font-medium mb-1.5 text-center">{borderStyle.label}</div>
                          <div 
                            className={`w-full h-2 transition-all ${getBorderClass(borderStyle.value)}`}
                            style={{ 
                              borderStyle: 'solid', 
                              borderWidth: '2px', 
                              borderColor: style.borderColor,
                              backgroundColor: 'transparent'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
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
