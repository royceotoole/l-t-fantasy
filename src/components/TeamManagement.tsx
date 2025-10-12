'use client';

import { useState, useEffect } from 'react';
import { Manager } from '@/types';

interface TeamManagementProps {
  managers: Manager[];
  onManagerUpdate: () => void;
}

export default function TeamManagement({ managers, onManagerUpdate }: TeamManagementProps) {
  const [localManagers, setLocalManagers] = useState<Manager[]>(managers);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalManagers(managers);
  }, [managers]);

  const assignManagerToTeam = async (managerId: string, team: 'lily' | 'teagan') => {
    setIsUpdating(true);
    try {
      // Update local state
      setLocalManagers(prev => 
        prev.map(manager => 
          manager.id === managerId ? { ...manager, team } : manager
        )
      );

      // Save to localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fantasy-data');
        if (stored) {
          const data = JSON.parse(stored);
          data.managers = data.managers.map((manager: Manager) => 
            manager.id === managerId ? { ...manager, team } : manager
          );
          localStorage.setItem('fantasy-data', JSON.stringify(data));
        }
      }

      onManagerUpdate();
    } catch (error) {
      console.error('Failed to update manager team:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const lilyManagers = localManagers.filter(m => m.team === 'lily');
  const teaganManagers = localManagers.filter(m => m.team === 'teagan');
  const unassignedManagers = localManagers.filter(m => !m.team || (m.team !== 'lily' && m.team !== 'teagan'));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Lily */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-pink-800 mb-4">Team Lily</h3>
          <div className="space-y-2">
            {lilyManagers.map(manager => (
              <div key={manager.id} className="bg-white border border-pink-200 rounded p-3">
                <div className="font-medium text-gray-800">{manager.yahooTeamName}</div>
                <div className="text-sm text-gray-600">{manager.name}</div>
                <button
                  onClick={() => assignManagerToTeam(manager.id, 'teagan')}
                  disabled={isUpdating}
                  className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-2 py-1 rounded transition-colors"
                >
                  Move to Teagan
                </button>
              </div>
            ))}
            {lilyManagers.length === 0 && (
              <div className="text-gray-500 text-sm">No managers assigned</div>
            )}
          </div>
        </div>

        {/* Team Teagan */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Team Teagan</h3>
          <div className="space-y-2">
            {teaganManagers.map(manager => (
              <div key={manager.id} className="bg-white border border-blue-200 rounded p-3">
                <div className="font-medium text-gray-800">{manager.yahooTeamName}</div>
                <div className="text-sm text-gray-600">{manager.name}</div>
                <button
                  onClick={() => assignManagerToTeam(manager.id, 'lily')}
                  disabled={isUpdating}
                  className="mt-2 text-xs bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-2 py-1 rounded transition-colors"
                >
                  Move to Lily
                </button>
              </div>
            ))}
            {teaganManagers.length === 0 && (
              <div className="text-gray-500 text-sm">No managers assigned</div>
            )}
          </div>
        </div>

        {/* Unassigned Managers */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Unassigned</h3>
          <div className="space-y-2">
            {unassignedManagers.map(manager => (
              <div key={manager.id} className="bg-white border border-gray-200 rounded p-3">
                <div className="font-medium text-gray-800">{manager.yahooTeamName}</div>
                <div className="text-sm text-gray-600">{manager.name}</div>
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => assignManagerToTeam(manager.id, 'lily')}
                    disabled={isUpdating}
                    className="text-xs bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-2 py-1 rounded transition-colors"
                  >
                    Lily
                  </button>
                  <button
                    onClick={() => assignManagerToTeam(manager.id, 'teagan')}
                    disabled={isUpdating}
                    className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-2 py-1 rounded transition-colors"
                  >
                    Teagan
                  </button>
                </div>
              </div>
            ))}
            {unassignedManagers.length === 0 && (
              <div className="text-gray-500 text-sm">All managers assigned</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Assign each manager to either Team Lily or Team Teagan. The scoring system will track wins and losses for each team.</p>
      </div>
    </div>
  );
}
