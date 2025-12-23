import Heading from '@/src/components/Heading';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import styles from './AudioFiles.module.scss';
import VideoThumbnail from 'react-video-thumbnail';
import ReactPlayer from 'react-player/soundcloud'; // Import ReactPlayer for SoundCloud

export default function AudioFiles(props) {
  const { audio_cards } = props;
  const [currentAudio, setCurrentAudio] = useState(null);

  const handlePlay = (videoRef) => {
    if (currentAudio && currentAudio !== videoRef) {
      currentAudio.pause();
    }
    setCurrentAudio(videoRef);
  };

  return (
    <section data-testid="audio-files" className="container mb-10">
      <div className="flex flex-col gap-4">
        {Array(audio_cards)
          .fill(null)
          .map((_, i) => {
            const mediaUrl = props[`audio_cards_${i}_media_url`];
            const heading = props[`audio_cards_${i}_title`];
            return <SingleAudioCard onPlay={handlePlay} mediaUrl={mediaUrl} heading={heading} />;
          })}
      </div>
    </section>
  );
}

const SingleAudioCard = ({ onPlay, mediaUrl, heading }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const speeds = [1, 1.5, 2];

  const isSoundCloud = ReactPlayer.canPlay(mediaUrl);

  const togglePlay = () => {
    if (!isSoundCloud) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        onPlay(audioRef.current);
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const skipTime = (seconds) => {
    if (!isSoundCloud && audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const cyclePlaybackSpeed = () => {
    if (!isSoundCloud && audioRef.current) {
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      audioRef.current.playbackRate = nextSpeed;
      setPlaybackSpeed(nextSpeed);
    }
  };

  const handleRangeChange = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  useEffect(() => {
    if (!isSoundCloud) {
      const audioElement = audioRef.current;

      const handleLoadedMetadata = () => {
        if (audioElement) {
          setDuration(audioElement.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (audioElement) {
          setProgress(audioElement.currentTime);
        }
      };

      if (audioElement) {
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
      }

      return () => {
        if (audioElement) {
          audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [isSoundCloud]);

  return (
    <div className="p-8 bg-brand-blue flex md:flex-row flex-col gap-6">
      {isSoundCloud &&<ReactPlayer url={mediaUrl} playing={isPlaying} controls width={"100%"} height={"200px"} />}
      {
        !isSoundCloud &&
        <>
          <div className="relative md:h-auto h-[9rem] md:max-w-[11.3rem] w-full">
            <VideoThumbnail
              videoUrl={mediaUrl}
              renderThumbnail={true}
              snapshotAtTime={1}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between items-start w-full gap-5">
            <Heading otherClasses="text-white text-p1 leading-[1.875rem] font-bold">{heading}</Heading>
            <div className="w-full rounded-md flex md:flex-row flex-col justify-center items-center gap-[1.563rem]">
              <audio ref={audioRef} onTimeUpdate={onTimeUpdate}>
                <source src={mediaUrl} />
              </audio>

              <div className="flex justify-center items-center flex-1 w-full gap-5">
                <div className="text-p2 font-semibold text-white">
                  {Math.floor(progress / 60)}:{('0' + Math.floor(progress % 60)).slice(-2)}
                </div>
                <input
                  type="range"
                  className={clsx(styles.customRange, 'w-full bg-white')}
                  value={(progress / duration) * 100}
                  onChange={handleRangeChange}
                />
                <div className="text-p2 font-semibold text-white">
                  {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                </div>
              </div>
              <div className="flex gap-3 justify-center items-center">
                <>
                  <button className="text-white mr-2" onClick={() => skipTime(-10)}>
                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Layer_1.svg"
                      alt="rewind"
                      height={32}
                      width={32}
                      className="h-8 w-8"
                    />
                  </button>
                  <button className="text-white mr-2" onClick={() => skipTime(10)}>
                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Layer_1-1.svg"
                      alt="fast-forward"
                      height={32}
                      width={32}
                      className="h-8 w-8"
                    />
                  </button>
                </>
                <button onClick={togglePlay}>
                  <Image
                    src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button_-Play-2.svg"
                    alt="play"
                    height={32}
                    width={32}
                    className="h-8 w-8"
                  />
                </button>
                <div
                  className="text-white text-p2 font-semibold font-manrope cursor-pointer"
                  onClick={cyclePlaybackSpeed}
                >
                  <span>{playbackSpeed}X</span>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
};
