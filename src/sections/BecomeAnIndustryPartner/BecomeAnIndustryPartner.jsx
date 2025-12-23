import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import styles from './BecomeAnIndustryPartner.module.scss';

export default function BecomeAnIndustryPartner(props) {
  const {
    title,
    heading,
    background_image,
    video_url,
    team_and_benefits_0_title,
    team_and_benefits_0_title_color,
    team_and_benefits_0_list,
    team_and_benefits_0_list_color,
    team_and_benefits_0_background_color,
    team_and_benefits_1_title,
    team_and_benefits_1_title_color,
    team_and_benefits_1_list,
    team_and_benefits_1_list_color,
    team_and_benefits_1_background_color
  } = props;

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section
      data-testid="become-an-industry-partner"
      className="w-full relative bg-cover bg-no-repeat mb-10"
      style={{ backgroundImage: `url(${background_image?.url})` }}
    >
      <div className="absolute top-0 left-0 bg-brand-royal-blue w-full h-full opacity-[0.88] " />
      <div className="max-w-screen-xl w-full lg:px-10 px-5 mx-auto md:pt-[3.75rem] pt-[1.5rem] md:pb-[3.625rem] pb-[1.25rem] z-10">
        <div className="flex flex-col justify-center md:gap-10 gap-6 ">
          <div className="flex flex-col gap-6 items-center justify-center">
            <HtmlBlock
              className="z-10 text-p2 rounded-[2.5rem] bg-brand-green w-max-content py-[0.375rem] px-6 font-normal text-white flex items-center justify-center"
              content={title}
            />
            <HtmlBlock
              className="z-10 font-manrope lg:!text-h2 !font-medium lg:[&>p]:!text-h2 !text-h3 [&>p]:!text-h3 [&>p]:!font-medium text-center text-white"
              content={heading}
            />
          </div>
          <div className="z-10 sm:h-[37.813rem] h-[25rem] relative">
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
                className="z-10 cursor-pointer absolute top-[50%] translate-x-[50%] translate-y-[-50%] right-[50%] flex-shrink-0"
              >
                <Image
                  src="https://mclsadmin.3lanemarketing.com/wp-content/uploads/2024/07/Button_-Play.svg"
                  alt="play-button"
                  width={40}
                  height={40}
                  className="w-[2.875rem] h-[2.875rem]"
                />
              </div>
            )}
          </div>
          <div className="flex w-full md:flex-row flex-col md:gap-[2.5rem] gap-5 justify-center items-flex-start">
            <div
              className={`z-10 flex max-w-1/2 w-full flex-col gap-4 md:pt-10 pt-6 md:pb-[1.875rem] pb-6 md:px-10 px-6 bg-${team_and_benefits_0_background_color}`}
            >
              <HtmlBlock
                className={`text-h3 font-semibold text-${team_and_benefits_0_title_color} text-start`}
                content={team_and_benefits_0_title}
              />
              <div className="w-full h-[0.075rem] bg-white" />
              <HtmlBlock
                content={team_and_benefits_0_list}
                className={`${styles.list} text-${team_and_benefits_0_list_color} `}
              />
            </div>
            <div
              className={`z-10 flex max-w-1/2 w-full flex-col gap-4 md:pt-10 pt-6 md:pb-[1.875rem] pb-6 md:px-10 px-6 bg-${team_and_benefits_1_background_color}`}
            >
              <HtmlBlock
                className={`text-h3 font-semibold text-${team_and_benefits_1_title_color} text-start`}
                content={team_and_benefits_1_title}
              />
              <div className="w-full h-[0.075rem] bg-white" />
              <HtmlBlock
                content={team_and_benefits_1_list}
                className={`${styles.list} text-${team_and_benefits_1_list_color}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
