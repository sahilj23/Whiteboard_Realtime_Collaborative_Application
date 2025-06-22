import React, { useState } from 'react';
import { Users, Share2, Settings, Palette, Sparkles } from 'lucide-react';
import RoomModal from './RoomModal';
import ExportModal from './ExportModal';

interface HeaderProps {
  roomCode?: string;
  participantCount?: number;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

const Header: React.FC<HeaderProps> = ({ roomCode, participantCount = 1, onCanvasRef }) => {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleShare = async () => {
    if (roomCode) {
      const shareUrl = `${window.location.origin}/room/${roomCode}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Room link copied to clipboard!');
      } catch (err) {
        prompt('Copy this link to share:', shareUrl);
      }
    } else {
      setShowRoomModal(true);
    }
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Palette className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Sparkles className="text-white" size={10} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  DrawSpace
                </h1>
                <p className="text-sm text-slate-600 font-medium">Collaborative Digital Canvas</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {roomCode && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 px-6 py-3 rounded-2xl">
                <Users size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  {participantCount} participant{participantCount !== 1 ? 's' : ''}
                </span>
                <div className="bg-white/80 px-3 py-1 rounded-lg">
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {roomCode}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <Share2 size={18} />
              {roomCode ? 'Share Room' : 'Create Room'}
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <Settings size={18} />
              Export
            </button>
          </div>
        </div>
      </header>

      <RoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onRoomCreated={(code) => {
          console.log('Room created:', code);
          setShowRoomModal(false);
        }}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onCanvasRef={onCanvasRef}
      />
    </>
  );
};

export default Header;