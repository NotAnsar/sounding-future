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

interface AudioContextType {
	currentTrack: Track | null;
	playlist: Track[];
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	toggleMute: () => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	formatTime: (time: number) => string;
	playTrack: (track: Track) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	setPlaylist: (tracks: Track[]) => void;
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

	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const playTrack = (track: Track) => {
		setCurrentTrack(track);
		if (soundRef.current) {
			soundRef.current.stop();
			soundRef.current.unload();
		}
		setCurrentTime(0);

		if (soundRef.current) {
			soundRef.current.play();
			setIsPlaying(true);
		}
	};

	const previousTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const previousIndex =
				(currentIndex - 1 + playlist.length) % playlist.length;
			playTrack(playlist[previousIndex]);
		}
	}, [playlist, currentTrack]);

	const nextTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const nextIndex = (currentIndex + 1) % playlist.length;
			playTrack(playlist[nextIndex]);
		}
	}, [playlist, currentTrack]);

	useEffect(() => {
		if (currentTrack) {
			if (soundRef.current) {
				soundRef.current.unload();
			}
			soundRef.current = new Howl({
				src: [currentTrack.songUrl],
				html5: true,
				onload: () => {
					setDuration(soundRef.current?.duration() || 0);
				},
				onplay: () => setIsPlaying(true),
				onpause: () => setIsPlaying(false),
				onstop: () => setIsPlaying(false),
				onend: () => nextTrack(),
			});
		}

		return () => {
			soundRef.current?.unload();
		};
	}, [currentTrack, nextTrack]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (soundRef.current && isPlaying) {
				setCurrentTime(soundRef.current.seek());
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isPlaying]);

	const value = {
		currentTrack,
		playlist,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		togglePlayPause,
		setVolume: handleVolumeChange,
		seek: handleSeek,
		formatTime,
		playTrack,
		nextTrack,
		previousTrack,
		setPlaylist,
		toggleMute,
	};

	return (
		<AudioContext.Provider value={value}>{children}</AudioContext.Provider>
	);
};

export interface Track {
	id: string;
	title: string;
	artist: string;
	album?: string;
	releaseDate?: string;
	genre?: string;
	duration?: number;
	label?: string;
	songUrl: string;
	coverUrl?: string;
}
