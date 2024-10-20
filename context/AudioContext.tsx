'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
	useCallback,
} from 'react';
import { Howl } from 'howler';
import { Track } from '@/config/dummy-data';

interface AudioContextType {
	currentTrack: Track | null;
	playlist: Track[];
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isLoop: boolean;
	toggleLoop: () => void;
	toggleMute: () => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	playNewTrack: (tracks: Track[], index?: number) => void;
	playTrack: (track: Track) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	setPlaylist: (tracks: Track[]) => void;
	resetAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error('useAudio must be used within an AudioProvider');
	}
	return context;
};

interface AudioProviderProps {
	children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
	const [playlist, setPlaylist] = useState<Track[]>([]);
	const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const soundRef = useRef<Howl | null>(null);
	const [isMuted, setIsMuted] = useState(false);
	const previousVolume = useRef(volume);
	const [isLoop, setIsLoop] = useState(false); // Initialize isLoop state

	const toggleLoop = useCallback(() => {
		setIsLoop((prev) => !prev);
	}, []);

	const toggleMute = useCallback(() => {
		if (soundRef.current) {
			if (isMuted) {
				soundRef.current.volume(previousVolume.current);
				setVolume(previousVolume.current);
			} else {
				previousVolume.current = volume;
				soundRef.current.volume(0);
				setVolume(0);
			}
			setIsMuted(!isMuted);
		}
	}, [isMuted, volume]);

	const togglePlayPause = useCallback(() => {
		if (soundRef.current) {
			if (isPlaying) {
				soundRef.current.pause();
			} else {
				soundRef.current.play();
			}
			setIsPlaying((prev) => !prev);
		}
	}, [isPlaying]);

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		if (soundRef.current) {
			soundRef.current.volume(newVolume);
		}
	};

	const handleSeek = (seekTime: number) => {
		setCurrentTime(seekTime);
		if (soundRef.current) {
			soundRef.current.seek(seekTime);
		}
	};

	const playTrack = useCallback(
		(track: Track, tracks?: Track[]) => {
			const loadStartTime = performance.now();

			if (!track) {
				setIsPlaying(false);
				setCurrentTrack(null);
				return;
			}

			// Create the new sound
			const newSound = new Howl({
				src: [track?.url],
				html5: true,
				preload: true,
				onload: () => {
					setDuration(newSound.duration());
					const loadEndTime = performance.now();
					const loadingDuration = loadEndTime - loadStartTime;
					console.log(`Track loaded in: ${loadingDuration} ms`);
				},

				onend: () => {
					const currentIndex = (tracks || playlist).findIndex(
						(t) => t.id === track.id
					);
					if (currentIndex === (tracks || playlist).length - 1) {
						// Last song in playlist
						if (isLoop) {
							// If loop is true, start from the first song
							playTrack((tracks || playlist)[0], tracks);
						} else {
							// If loop is false, pause playback
							setIsPlaying(false);
						}
					} else {
						// Not the last song, play next track as normal
						const nextIndex = (currentIndex + 1) % (tracks || playlist).length;
						playTrack((tracks || playlist)[nextIndex], tracks);
					}
				},
			});

			// Update state once
			setCurrentTrack(track);
			setCurrentTime(0);

			setIsPlaying((prevState) => {
				if (!prevState) return true;

				return prevState;
			});

			// Start playing the new sound
			newSound.play();

			// Clean up the old sound
			if (soundRef.current) {
				soundRef.current.unload();
			}

			soundRef.current = newSound;
		},
		[playlist, isLoop]
	);

	const playNewTrack = useCallback(
		(tracks: Track[], index: number = 0) => {
			setPlaylist(tracks);
			playTrack(tracks[index], tracks);

			// Preload the next track
			if (tracks.length > 1) {
				const nextIndex = (index + 1) % tracks.length;
				new Howl({ src: [tracks[nextIndex].url], preload: true });
			}
		},
		[playTrack]
	);

	const previousTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const previousIndex =
				(currentIndex - 1 + playlist.length) % playlist.length;
			playTrack(playlist[previousIndex]);
		}
	}, [playlist, currentTrack, playTrack]);

	const nextTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const nextIndex = (currentIndex + 1) % playlist.length;
			playTrack(playlist[nextIndex]);
		}
	}, [playlist, currentTrack, playTrack]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (soundRef.current && isPlaying) {
				setCurrentTime(soundRef.current.seek());
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isPlaying]);

	const resetAudio = useCallback(() => {
		if (soundRef.current) {
			soundRef.current.stop();
			soundRef.current.unload();
		}
		setCurrentTrack(null);
		setIsPlaying(false);
		setCurrentTime(0);
		setDuration(0);
		// Reset any other relevant state
	}, []);

	const value = {
		currentTrack,
		playlist,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		isLoop,
		togglePlayPause,
		setVolume: handleVolumeChange,
		seek: handleSeek,
		playTrack,
		nextTrack,
		previousTrack,
		setPlaylist,
		toggleMute,
		playNewTrack,
		toggleLoop,
		resetAudio,
	};

	return (
		<AudioContext.Provider value={value}>{children}</AudioContext.Provider>
	);
};
