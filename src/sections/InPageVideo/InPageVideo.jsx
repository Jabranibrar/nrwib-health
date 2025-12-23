import React, { useEffect } from 'react';
import clsx from 'clsx';
import NextImage from '../../components/NextImage';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Loader from '../../components/Loader/Loader';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export const InPageVideo = ({ otherClasses, external_link, thumbnail }) => {
  const [loading, setLoading] = useState(false);

  const playIcon = {
    url: 'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Play-Button.png',
    alt: 'Play Button',
    width: 100,
    height: 100
  };

  const inPageVideoClasses = clsx(otherClasses);

  const [thumbnailSrc, setThumbnailSrc] = useState(null);

  useEffect(() => {
    // Function to extract video ID from the YouTube URL
    const extractVideoId = (url) => {
      const match = url.match(/(?:\/|%3D|v=|vi=)([0-9A-z-_]{11})(?:[%#?&]|$)/);
      return match ? match[1] : null; // Extract the video ID for YouTube videos
    };

    // Function to generate the YouTube thumbnail URL based on the video ID
    const generateThumbnailSrc = (videoUrl) => {
      const videoId = extractVideoId(videoUrl);
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    // Generate the thumbnail source
    const thumbnailSrc = generateThumbnailSrc(external_link);
    setThumbnailSrc(thumbnailSrc);
  }, [external_link]);

  return (
    <section className="container">
      <div
        className={`${inPageVideoClasses} w-full my-10 flex justify-center items-center mb-6 md:mb-12`}
      >
        {loading && <Loader />}
        <div className={'min-h-[120px] w-full '}>
          <ReactPlayer
            url={external_link}
            controls
            playing
            onBuffer={() => setLoading(true)}
            onBufferEnd={() => setLoading(false)}
            light={
              thumbnail?.url ? (
                <NextImage
                  otherClasses="w-full h-full z-[-1] object-cover object-center"
                  {...thumbnail}
                />
              ) : (
                <NextImage
                  otherClasses="w-full h-full z-[-1] object-cover object-center"
                  height={1000}
                  width={1000}
                  url={thumbnailSrc}
                />
              )
            }
            playIcon={
              playIcon?.url ? (
                <span className="absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] block z-10 w-[35px] h-[35px] lg:w-20 lg:h-20">
                  <NextImage {...playIcon} />
                </span>
              ) : (
                <span className="absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] block z-10 w-[35px] h-[35px] lg:w-20 lg:h-20">
                  <NextImage
                    url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Play-Button.png"
                    alt="Play Button"
                    width={100}
                    height={100}
                    otherClasses="w-full h-full"
                  />
                </span>
              )
            }
            className={`!w-full !h-[350px] md:!h-[600px] relative`}
          />
        </div>
      </div>
    </section>
  );
};

export default InPageVideo;
