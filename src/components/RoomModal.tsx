import React, { useState } from 'react';
import { X, Users, Lock, Globe, Copy, Check } from 'lucide-react';
import { generateRoomCode } from '../utils/helpers';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomCode: string) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateRoom = () => {
    const roomCode = generateRoomCode();
    setCreatedRoom(roomCode);
    onRoomCreated(roomCode);
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      onRoomCreated(joinCode.trim().toUpperCase());
      onClose();
    }
  };

  const copyRoomLink = async () => {
    if (createdRoom) {
      const link = `${window.location.origin}/room/${createdRoom}`;
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {createdRoom ? 'Room Created!' : isJoining ? 'Join Room' : 'Create Room'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {createdRoom ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-600" size={20} />
                <span className="font-semibold text-green-800">Room Code</span>
              </div>
              <div className="font-mono text-2xl text-green-800 bg-white px-4 py-2 rounded-xl border">
                {createdRoom}
              </div>
            </div>

            <button
              onClick={copyRoomLink}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy Share Link'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Share this code or link with others to collaborate!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setIsJoining(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  !isJoining
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Create New
              </button>
              <button
                onClick={() => setIsJoining(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  isJoining
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Join Existing
              </button>
            </div>

            {isJoining ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit room code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={handleJoinRoom}
                  disabled={joinCode.length !== 6}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Join Room
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="My Whiteboard Session"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isPrivate ? <Lock size={20} className="text-gray-600" /> : <Globe size={20} className="text-gray-600" />}
                    <div>
                      <div className="font-medium text-gray-900">
                        {isPrivate ? 'Private Room' : 'Public Room'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isPrivate ? 'Only invited users can join' : 'Anyone with the code can join'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isPrivate ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        isPrivate ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Create Room
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomModal;