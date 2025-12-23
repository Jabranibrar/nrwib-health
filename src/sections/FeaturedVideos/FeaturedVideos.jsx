import Image from 'next/image';
import React, { useState } from 'react';
import HtmlBlock from '@/src/components/HtmlBlock';
import ReactPlayer from 'react-player';
import CustomLink from '@/src/components/CustomLink';

export default function FeaturedVideos(props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { heading, text, video_url, button_anchor, button_variant } = props;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const button = {
    anchor: {
      title: button_anchor?.title,
      url: button_anchor?.url
    },
    variant: button_variant
  };

  return (
    <section data-testid="featured-video" className="bg-brand-blue-sky">
      <div className="flex flex-col items-start justify-between gap-10 max-w-screen-xl w-full lg:px-10 px-5 mx-auto mb-10 py-[3.75rem]">
        <div className="w-full sm:h-[38.813rem] h-[25rem] relative">
          <ReactPlayer
            playing={isPlaying}
            url={video_url}
            controls
            width="100%"
            height="100%"
            className="h-full w-full object-cover"
            onPause={handlePause}
            onPlay={handlePlay}
          />
          {!isPlaying && (
            <div
              onClick={handlePlayClick}
              className="cursor-pointer absolute top-[50%] translate-x-[50%] translate-y-[-50%] right-[50%] flex-shrink-0"
            >
              <Image
                src="https://mclsadmin.3lanemarketing.com/wp-content/uploads/2024/07/Button_-Play.svg"
                alt=""
                width={40}
                height={40}
                className="w-[2.875rem] h-[2.875rem]"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 justify-between items-start">
          <h2 className="text-brand-white lg:text-h2 h3 font-semibold text-start">{heading}</h2>
          <HtmlBlock className="text-p2 font-normal text-brand-white text-start" content={text} />
        </div>
        <CustomLink {...button} />
      </div>
    </section>
  );
}
