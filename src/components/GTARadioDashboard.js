import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const stations = [
  { id: 'chatterbox', name: 'Chatterbox', genre: 'Talk Radio', color: 'bg-green-400', audio: '1.Grand Theft Auto III - Chatterbox FM.mp3', image: 'chatterbox.jpeg', size: 'large' },
  { id: 'lcfr', name: 'Liberty City Free Radio', genre: 'Talk Radio', color: 'bg-yellow-400', audio: '2.GTA Liberty City Stories Radio Stations 10 - LCFR (Liberty City Free Radio).mp3', image: 'lcfr2.png', size: 'medium' },
  { id: 'wctr', name: 'West Coast Talk Radio', genre: 'Talk Radio', color: 'bg-purple-400', audio: '4.Grand Theft Auto 5 - West Coast Talk Radio - Full Radio Station.mp3', image: 'WCTR.jfif', size: 'small' },
  { id: 'wctrsa', name: 'West Coast Talk Radio (San Andreas)', genre: 'Talk Radio', color: 'bg-blue-400', audio: '5.WCTR (West Coast Talk Radio) (San Andreas).mp3', image: 'WCTRSA.jpg', size: 'small' },
  { id: 'vcpr', name: 'Vice City Public Radio', genre: 'Talk Radio', color: 'bg-orange-400', audio: '6.VCPR Full - Pressing Issues.mp3', image: 'pressingissues.webp', size: 'medium' },
  { id: 'weazelNews', name: 'Weazel News Reports', genre: 'News', color: 'bg-indigo-400', audio: '7. Weazel News Report.mp3', image: 'weazelNews.jfif', size: 'small' },
  { id: 'kchat', name: 'K-Chat', genre: 'Talk Radio', color: 'bg-pink-400', audio: '3.Grand Theft Auto_ Vice City - K-Chat.mp3', image: 'kchat.jpg', size: 'small' },
];

const RadioStation = ({ station, isPlaying, onPlay, className }) => (
  <div 
    className={`rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer ${station.color} ${className} relative overflow-hidden`}
    onClick={() => onPlay(station.id)}
  >
    <img 
      src={`/images/${station.image}`} 
      alt={station.name}
      className="absolute inset-0 w-full h-full object-cover"
    />
    {isPlaying && (
      <div className="absolute bottom-2 right-2 flex items-center">
        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
      </div>
    )}
  </div>
);

const GTARadioDashboard = () => {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

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

  const handlePlay = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    if (currentStation !== stationId) {
      setCurrentStation(stationId);
      if (audioRef.current) {
        audioRef.current.src = `/audio/${station.audio}`;
        audioRef.current.play();
      }
    }
    setIsPlaying(true);
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

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 md:grid-rows-6 gap-4 h-auto md:h-[800px]">
        <RadioStation 
          station={stations[0]} 
          isPlaying={currentStation === stations[0].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-2 sm:col-span-3 md:col-span-6 md:row-span-4 aspect-square md:aspect-auto"
        />
        <RadioStation 
          station={stations[1]} 
          isPlaying={currentStation === stations[1].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-2 sm:col-span-3 md:col-span-6 md:row-span-2 aspect-[4/3] sm:aspect-[16/9] md:aspect-auto"
        />
        <RadioStation 
          station={stations[2]} 
          isPlaying={currentStation === stations[2].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-1 sm:col-span-1 md:col-span-3 md:row-span-2 aspect-square md:aspect-auto"
        />
        <RadioStation 
          station={stations[3]} 
          isPlaying={currentStation === stations[3].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-1 sm:col-span-1 md:col-span-3 md:row-span-2 aspect-square md:aspect-auto"
        />
        <RadioStation 
          station={stations[4]} 
          isPlaying={currentStation === stations[4].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-2 sm:col-span-2 md:col-span-4 md:row-span-2 aspect-[4/3] sm:aspect-[16/9] md:aspect-auto"
        />
        <RadioStation 
          station={stations[5]} 
          isPlaying={currentStation === stations[5].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-1 sm:col-span-1 md:col-span-4 md:row-span-2 aspect-[3/4] sm:aspect-square md:aspect-auto"
        />
        <RadioStation 
          station={stations[6]} 
          isPlaying={currentStation === stations[6].id && isPlaying}
          onPlay={handlePlay}
          className="col-span-1 sm:col-span-1 md:col-span-4 md:row-span-2 aspect-[3/4] sm:aspect-square md:aspect-auto"
        />
      </div>
      <div className="h-24 md:h-32"></div>
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 player-gradient text-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <img 
                  src={`/images/${stations.find(s => s.id === currentStation).image}`} 
                  alt={stations.find(s => s.id === currentStation).name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg md:text-2xl font-bold station-name-gta neon-text truncate">
                    {stations.find(s => s.id === currentStation).name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300">
                    {stations.find(s => s.id === currentStation).genre}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-6">
                <div className="hidden md:flex space-x-1">
                  {[1,2,3,4,5].map((_, index) => (
                    <div key={index} className="equalizer-bar" style={{animationDelay: `${index * 0.1}s`}}></div>
                  ))}
                </div>
                <button 
                  onClick={togglePlayPause} 
                  className="p-2 md:p-3 rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors transform hover:scale-110"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="flex items-center space-x-2">
                  <Volume2 size={20} />
                  <input 
                    type="range" 
                    className="volume-slider w-20 md:w-24"
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime || 0}
                onChange={handleSeek}
                className="flex-grow"
              />
              <span className="text-xs md:text-sm">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
};

export default GTARadioDashboard;
