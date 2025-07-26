import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DUNGEON_ROOMS } from '../../data/gameData';

const DungeonMap = ({ currentRoom, onEnterRoom, completedRooms }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Animate map entrance
    gsap.fromTo('.room-node', 
      { scale: 0, rotation: 180 }, 
      { scale: 1, rotation: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
    );
  }, []);

  const getRoomStatus = (roomId) => {
    if (completedRooms.includes(roomId)) return 'completed';
    if (roomId === currentRoom) return 'current';
    
    // Check if room is unlocked
    const room = DUNGEON_ROOMS[roomId];
    if (roomId === 0) return 'available'; // Starting room
    
    // Check if any prerequisite rooms are completed
    const prerequisites = Object.values(DUNGEON_ROOMS)
      .filter(r => r.unlocks && r.unlocks.includes(roomId))
      .map(r => r.id);
    
    const hasPrerequisites = prerequisites.some(prereq => completedRooms.includes(prereq));
    return hasPrerequisites ? 'available' : 'locked';
  };

  const handleRoomClick = (roomId) => {
    const status = getRoomStatus(roomId);
    if (status === 'available' || status === 'current') {
      // Animate room selection
      gsap.to(`.room-${roomId}`, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => onEnterRoom(roomId)
      });
    } else {
      // Shake animation for locked rooms
      gsap.to(`.room-${roomId}`, {
        x: -5,
        duration: 0.1,
        yoyo: true,
        repeat: 5
      });
    }
  };

  const getRoomIcon = (room) => {
    switch (room.type) {
      case 'tutorial': return '🏛️';
      case 'puzzle': return '🧩';
      case 'battle': return '⚔️';
      case 'shop': return '🏪';
      default: return '🚪';
    }
  };

  const getRoomColor = (roomId) => {
    const status = getRoomStatus(roomId);
    switch (status) {
      case 'completed': return 'bg-green-600 border-green-400';
      case 'current': return 'bg-blue-600 border-blue-400 animate-pulse';
      case 'available': return 'bg-purple-600 border-purple-400 hover:bg-purple-500';
      case 'locked': return 'bg-gray-600 border-gray-500 opacity-50';
      default: return 'bg-gray-600 border-gray-500';
    }
  };

  // Define room positions on the map (grid-based layout)
  const roomPositions = {
    0: { x: 50, y: 90 }, // Entrance at bottom center
    1: { x: 25, y: 70 }, // Left branch
    2: { x: 75, y: 70 }, // Right branch
    3: { x: 15, y: 50 }, // Left upper
    4: { x: 35, y: 50 }, // Left-center upper
    5: { x: 65, y: 50 }, // Right-center upper
    6: { x: 85, y: 50 }, // Right upper
    7: { x: 25, y: 30 }, // Left top
    8: { x: 75, y: 30 }, // Right top
    9: { x: 50, y: 10 }, // Center top
    10: { x: 50, y: 5 }, // Final boss at very top
    11: { x: 20, y: 15 }, // Bonus room - treasure vault
    12: { x: 80, y: 15 }, // Bonus room - trading arena
    13: { x: 35, y: 8 },  // Bonus room - time chamber
    14: { x: 65, y: 8 }   // Bonus room - risk academy
  };

  return (
    <div className="dungeon-map w-full h-screen relative bg-gradient-to-b from-gray-900 to-black overflow-hidden" ref={mapRef}>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl">🏰</div>
        <div className="absolute top-20 right-20 text-4xl">🌙</div>
        <div className="absolute bottom-20 left-20 text-5xl">💀</div>
        <div className="absolute bottom-10 right-10 text-4xl">⭐</div>
      </div>

      {/* Connection lines between rooms */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        {Object.entries(DUNGEON_ROOMS).map(([roomId, room]) => {
          if (!room.unlocks || room.unlocks.length === 0) return null;
          
          const startPos = roomPositions[parseInt(roomId)];
          if (!startPos) return null;
          
          return room.unlocks.map(unlockedRoomId => {
            const endPos = roomPositions[unlockedRoomId];
            if (!endPos) return null;
            
            return (
              <line
                key={`${roomId}-${unlockedRoomId}`}
                x1={`${startPos.x}%`}
                y1={`${startPos.y}%`}
                x2={`${endPos.x}%`}
                y2={`${endPos.y}%`}
                stroke="#4B5563"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-60"
              />
            );
          }).filter(Boolean);
        }).flat().filter(Boolean)}
      </svg>

      {/* Room nodes */}
      {Object.entries(DUNGEON_ROOMS).map(([roomId, room]) => {
        const position = roomPositions[parseInt(roomId)];
        
        // Skip rooms without defined positions
        if (!position) {
          console.warn(`No position defined for room ${roomId}`);
          return null;
        }
        
        const status = getRoomStatus(parseInt(roomId));
        
        return (
          <div
            key={roomId}
            className={`room-node room-${roomId} absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${getRoomColor(parseInt(roomId))}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: 2
            }}
            onClick={() => handleRoomClick(parseInt(roomId))}
          >
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative">
              <span className="text-2xl">{getRoomIcon(room)}</span>
              
              {/* Room number badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                {roomId}
              </div>
              
              {/* Completion indicator */}
              {status === 'completed' && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}
              
              {/* Lock indicator */}
              {status === 'locked' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <span className="text-xl">🔒</span>
                </div>
              )}
            </div>
            
            {/* Room name tooltip */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {room.name}
              <div className="text-xs text-gray-300">{room.concept}</div>
            </div>
          </div>
        );
      }).filter(Boolean)}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 p-4 rounded-lg text-sm">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded animate-pulse"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded opacity-50"></div>
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Current room info */}
      {currentRoom !== null && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-80 p-4 rounded-lg max-w-sm">
          <h3 className="font-bold text-lg">{DUNGEON_ROOMS[currentRoom]?.name}</h3>
          <p className="text-sm text-gray-300 mb-2">{DUNGEON_ROOMS[currentRoom]?.concept}</p>
          <p className="text-xs">{DUNGEON_ROOMS[currentRoom]?.description}</p>
        </div>
      )}
    </div>
  );
};

export default DungeonMap;
