
import React from 'react';
import { X, Trophy, CheckCircle, Clock } from 'lucide-react';
import { Mission } from '../utils/userProfile';

interface MissionsPanelProps {
  missions: Mission[];
  onClose: () => void;
}

const MissionsPanel: React.FC<MissionsPanelProps> = ({ missions, onClose }) => {
  const completedMissions = missions.filter(m => m.completed);
  const activeMissions = missions.filter(m => !m.completed);

  const getProgressPercentage = (mission: Mission) => {
    return Math.min((mission.progress / mission.target) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            <h2 className="text-xl font-semibold text-slate-800">Missioni</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Missioni Attive */}
          {activeMissions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Missioni Attive
              </h3>
              <div className="space-y-3">
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-slate-800">{mission.name}</h4>
                        <p className="text-sm text-slate-600">{mission.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          +{mission.reward} XP
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(mission)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missioni Completate */}
          {completedMissions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                Completate
              </h3>
              <div className="space-y-3">
                {completedMissions.map((mission) => (
                  <div key={mission.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <div>
                          <h4 className="font-medium text-slate-800">{mission.name}</h4>
                          <p className="text-sm text-slate-600">{mission.description}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +{mission.reward} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {missions.length === 0 && (
            <div className="text-center py-8">
              <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Nessuna missione disponibile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionsPanel;
