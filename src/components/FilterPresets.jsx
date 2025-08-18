import { useState, useEffect } from 'react';

export default function FilterPresets({ onApplyPreset }) {
  const [savedPresets, setSavedPresets] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Load saved presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cryptoFilterPresets');
    if (saved) {
      setSavedPresets(JSON.parse(saved));
    }
  }, []);

  // Save presets to localStorage
  const savePresets = (presets) => {
    localStorage.setItem('cryptoFilterPresets', JSON.stringify(presets));
    setSavedPresets(presets);
  };

  // Save current filters as preset
  const saveCurrentPreset = (currentFilters) => {
    if (!presetName.trim()) return;

    const newPreset = {
      id: Date.now(),
      name: presetName.trim(),
      filters: currentFilters,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedPresets, newPreset];
    savePresets(updated);
    setPresetName('');
    setShowSaveModal(false);
  };

  // Delete preset
  const deletePreset = (presetId) => {
    const updated = savedPresets.filter(p => p.id !== presetId);
    savePresets(updated);
  };

  if (savedPresets.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white">Saved Filter Presets</h4>
        <button
          onClick={() => setShowSaveModal(true)}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
        >
          Save Current
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {savedPresets.map((preset) => (
          <div key={preset.id} className="flex items-center bg-gray-700 rounded-full">
            <button
              onClick={() => onApplyPreset(preset.filters)}
              className="px-3 py-1 text-sm text-white hover:bg-gray-600 rounded-l-full transition-colors"
            >
              {preset.name}
            </button>
            <button
              onClick={() => deletePreset(preset.id)}
              className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded-r-full"
              title="Delete preset"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Save Filter Preset</h3>
            <input
              type="text"
              placeholder="Enter preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => saveCurrentPreset()}
                disabled={!presetName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPresetName('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
