import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/src/components/Icon';

export default function VideoCards(props) {
  const { video_cards, showPopup = false } = props;
  const [currentVideo, setCurrentVideo] = useState(null);

  const handlePlay = (videoRef) => {
    if (currentVideo && currentVideo !== videoRef) {
      currentVideo.pause();
    }
    setCurrentVideo(videoRef);
  };

  return (
    <section data-testid="video-cards" className="container mb-10">
      <div className="flex flex-wrap justify-center items-stretch gap-[1.813rem]">
        {Array(video_cards)
          .fill(null)
          .map((_, i) => {
            const videoUrl = props[`video_cards_${i}_video_url`];
            const heading = props[`video_cards_${i}_title`];
            const text = props[`video_cards_${i}_text`];
            return (
              <SingleVideoCard
                key={i}
                videoUrl={videoUrl}
                heading={heading}
                text={text}
                onPlay={handlePlay}
                popup={showPopup}
              />
            );
          })}
      </div>
    </section>
  );
}

const SingleVideoCard = ({ videoUrl, heading, text, onPlay, popup = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const videoRef = useRef(null);

  const playVideo = () => {
    if (videoRef.current) {
      onPlay && onPlay(videoRef.current);
      videoRef.current.play();
    }
  };

  const openPopup = () => {
    setShowPopup(true);
    setIsPlaying(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
  };

  // Check if the video URL is from YouTube
  const isYouTubeUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  return (
    <div className="px-5 md:px-6 pb-[2.875rem] pt-8 bg-brand-blue max-w-[27.9rem] w-full h-auto">
      <div className="relative h-[11.7rem] w-full max-w-[24.4rem]">
        {!isPlaying && (
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button_-Play-1.svg"
            alt="play"
            height={popup ? 72 : 48}
            width={popup ? 72 : 48}
            className={`${popup ? 'h-24 w-24' : 'h-12 w-12'} absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 cursor-pointer`}
            onClick={popup ? openPopup : playVideo}
          />
        )}

        {isYouTubeUrl ? (
          <iframe
            width="100%"
            height="100%"
            onClick={() => setIsPlaying(true)}
            src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`${popup ? 'pointer-events-none' : ''} h-full w-full object-cover`}
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            onPause={() => setIsPlaying(false)}
            onPlay={() => {
              setIsPlaying(true);
              if (!popup) playVideo();
            }}
            className="h-full w-full object-cover"
            controls
          >
            <source src={videoUrl} />
          </video>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Heading otherClasses="text-white text-p1 leading-[1.875rem] font-bold">{heading}</Heading>
        <div className="h-[0.063rem] w-full bg-white"></div>
        <HtmlBlock content={text} className="line-clamp-5 text-white text-p2" />
      </div>

      {/* Popup Modal */}
      {popup && showPopup && (
        <div className="fixed inset-0 bg-brand-blue bg-opacity-50 flex items-center justify-center z-20">
          <div className="relative w-full max-w-6xl p-8 bg-brand-neutral-2">
            <button
              onClick={closePopup}
              className="absolute -top-6 -right-6 text-black text-lg font-bold"
            >
              <Icon icon="popup-close-icon" iconWidth={56} iconHeight={56} />
            </button>
            {isYouTubeUrl ? (
              <div className={"video-embed"}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full object-cover"
                ></iframe>
              </div>

            ) : (
              <video
                ref={videoRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="h-full w-full object-cover"
                controls
                autoPlay
              >
                <source src={videoUrl} />
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};