import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Clock, Loader2 } from 'lucide-react';

const stations = [
  { id: 'chatterbox', name: 'Chatterbox', genre: 'Talk Radio', color: 'bg-green-400', audio: '1.Grand Theft Auto III - Chatterbox FM.mp3', image: 'chatterbox.jpeg', size: 'large' },
  { id: 'lcfr', name: 'Liberty City Free Radio', genre: 'Talk Radio', color: 'bg-yellow-400', audio: '2.GTA Liberty City Stories Radio Stations 10 - LCFR (Liberty City Free Radio).mp3', image: 'lcfr2.png', size: 'medium' },
  { id: 'wctr', name: 'West Coast Talk Radio', genre: 'Talk Radio', color: 'bg-purple-400', audio: '4.Grand Theft Auto 5 - West Coast Talk Radio - Full Radio Station.mp3', image: 'WCTR.jfif', size: 'small' },
  { id: 'wctrsa', name: 'West Coast Talk Radio (San Andreas)', genre: 'Talk Radio', color: 'bg-blue-400', audio: '5.WCTR (West Coast Talk Radio) (San Andreas).mp3', image: 'WCTRSA.jpg', size: 'small' },
  { id: 'vcpr', name: 'Vice City Public Radio', genre: 'Talk Radio', color: 'bg-orange-400', audio: '6.VCPR Full - Pressing Issues.mp3', image: 'pressingissues.webp', size: 'medium' },
  { id: 'weazelNews', name: 'Weazel News Reports', genre: 'News', color: 'bg-indigo-400', audio: '7. Weazel News Report.mp3', image: 'weazelNews.jfif', size: 'small' },
  { id: 'kchat', name: 'K-Chat', genre: 'Talk Radio', color: 'bg-pink-400', audio: '3.Grand Theft Auto_ Vice City - K-Chat.mp3', image: 'kchat.jpg', size: 'small' },
];

const RadioStation = ({ station, isPlaying, isLoading, onPlay, className }) => (
  <div 
    className={`relative rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer group overflow-hidden ${className}`}
    onClick={() => onPlay(station.id)}
    role="button"
    aria-label={`Play ${station.name} radio station`}
  >
    <div className="absolute inset-0">
      <img 
        src={`/images/${station.image}`} 
        alt={station.name}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/fallback.jpg';
          e.target.alt = 'Fallback station image';
        }}
      />
    </div>
    
    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${
      isPlaying ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
    } transition-opacity duration-300`} />
    
    <div className="absolute bottom-0 left-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-white text-lg font-bold drop-shadow-md">{station.name}</h3>
      <p className="text-gray-300 text-sm font-medium">{station.genre}</p>
    </div>

    {isPlaying && (
      <div className={`absolute inset-0 ring-4 ${station.color.replace('bg', 'ring')} rounded-2xl pointer-events-none`}>
        <div className="absolute bottom-3 right-3 flex items-center space-x-1.5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            [...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))
          )}
        </div>
      </div>
    )}
  </div>
);

const GTARadioDashboard = () => {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('radio-volume');
    return savedVolume ? parseInt(savedVolume, 10) : 20;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seekPreview, setSeekPreview] = useState(null);
  const [showElapsed, setShowElapsed] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [currentStation]);

  const handlePlay = async (stationId) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const station = stations.find(s => s.id === stationId);
    
    try {
      if (currentStation !== stationId) {
        setCurrentStation(stationId);
        if (audioRef.current) {
          audioRef.current.src = `/audio/${station.audio}`;
          await audioRef.current.play();
        }
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSeekHover = (e) => {
    if (!duration) return;
    const rect = e.target.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    setSeekPreview(formatTime(percentage * duration));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    localStorage.setItem('radio-volume', newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(Math.abs(time) / 60);
    const seconds = Math.floor(Math.abs(time) % 60);
    return `${time < 0 ? '-' : ''}${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    if (!duration) return '0:00';
    return formatTime(duration - currentTime);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 pb-32 md:pb-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 md:grid-rows-6 gap-3 md:gap-4 h-auto md:h-[800px]">
        {stations.map((station) => (
          <RadioStation
            key={station.id}
            station={station}
            isPlaying={currentStation === station.id && isPlaying}
            isLoading={currentStation === station.id && isLoading}
            onPlay={handlePlay}
            className={`
              ${station.size === 'large' ? 'md:col-span-6 md:row-span-4' : ''}
              ${station.size === 'medium' ? 'md:col-span-6 md:row-span-2' : ''}
              ${station.size === 'small' ? 'md:col-span-3 md:row-span-2' : ''}
              aspect-square md:aspect-auto
            `}
          />
        ))}
      </div>

      {currentStation && (
        <div className={`fixed ${isMobile ? 'inset-x-0 bottom-0 mx-3 max-w-[calc(100%-1.5rem)]' : 'left-4 right-4 mx-auto max-w-4xl bottom-4'} bg-black/90 backdrop-blur-2xl rounded-t-2xl border border-white/10 shadow-2xl transition-transform duration-300 ${isMobile ? 'hover:scale-[1.02] active:scale-[1.01]' : ''}`}>
          
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={`/images/${stations.find(s => s.id === currentStation).image}`} 
                    className="w-full h-full object-cover"
                    alt={stations.find(s => s.id === currentStation).name}
                  />
                </div>
                <div className="max-w-[160px]">
                  <h3 className="text-[13px] font-semibold text-white truncate">
                    {stations.find(s => s.id === currentStation).name}
                  </h3>
                  <p className="text-xs text-gray-300 truncate">
                    {stations.find(s => s.id === currentStation).genre}
                  </p>
                </div>
              </div>
              <button 
                onClick={togglePlayPause}
                disabled={isLoading}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-300 relative"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white pl-0.5" />
                )}
              </button>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="range"
                  className="w-full h-1.5 bg-white/20 accent-white/80 rounded-full cursor-pointer"
                  min="0"
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={handleSeek}
                  onMouseMove={handleSeekHover}
                  onMouseLeave={() => setSeekPreview(null)}
                  aria-label="Seek timeline"
                />
                {seekPreview && (
                  <div 
                    className="absolute bottom-4 px-2 py-1 bg-black/80 text-white text-xs rounded-md"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  >
                    {seekPreview}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowElapsed(!showElapsed)}
                  className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                  aria-label="Toggle time display"
                >
                  <Clock size={12} />
                  <span className="text-[11px]">
                    {showElapsed ? formatTime(currentTime) : getRemainingTime()}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 w-28 group">
                  <Volume2 size={14} className="text-white/80" />
                  <input 
                    type="range"
                    className="w-full h-1.5 bg-white/20 accent-white/80"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume control"
                  />
                  <span className="text-xs text-white/80 w-8">
                    {volume}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between p-4 h-16 gap-4">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-white/20">
                <img 
                  src={`/images/${stations.find(s => s.id === currentStation).image}`} 
                  className="w-full h-full object-cover"
                  alt={stations.find(s => s.id === currentStation).name}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white truncate">
                  {stations.find(s => s.id === currentStation).name}
                </h3>
                <p className="text-xs text-gray-300 truncate">
                  {stations.find(s => s.id === currentStation).genre}
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-4 max-w-2xl px-6">
              <div className="relative w-full group">
                <input
                  type="range"
                  className="w-full h-1.5 bg-white/20 accent-white/80 rounded-full cursor-pointer"
                  min="0"
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={handleSeek}
                  onMouseMove={handleSeekHover}
                  onMouseLeave={() => setSeekPreview(null)}
                  aria-label="Seek timeline"
                />
                {seekPreview && (
                  <div 
                    className="absolute bottom-4 px-2 py-1 bg-black/80 text-white text-xs rounded-md"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  >
                    {seekPreview}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowElapsed(!showElapsed)}
                className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
                aria-label="Toggle time display"
              >
                <Clock size={14} />
                <span className="tabular-nums">
                  {showElapsed ? formatTime(currentTime) : getRemainingTime()}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 min-w-[200px] justify-end">
              <div className="flex items-center gap-2 w-36">
                <Volume2 size={18} className="text-white/80" />
                <input 
                  type="range"
                  className="w-full h-1.5 bg-white/20 accent-white/80"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume control"
                />
                <span className="text-xs text-white/80 w-8">
                  {volume}%
                </span>
              </div>
              <button 
                onClick={togglePlayPause}
                disabled={isLoading}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-300"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white pl-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
};

export default GTARadioDashboard;