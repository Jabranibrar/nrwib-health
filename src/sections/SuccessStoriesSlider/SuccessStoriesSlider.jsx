import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Slider from 'react-slick';
import clsx from 'clsx';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextLink from '@/src/components/NextLink';
import styles from './SuccessStoriesSlider.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import SingleSelect from '@/src/components/SingleSelect';

export default function SuccessStoriesSlider(props) {
  const { heading, success_stories_slider, button_anchor, button_variant, hideFilter = false, bgColor = 'bg-brand-neutral-3' } = props;
  const [progressIndex, setProgressIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [progressWidth, setProgressWidth] = useState('');
  const [playingVideoIndex, setPlayingVideoIndex] = useState(false);
  const [selectedArea, setSelectedArea] = useState('All');
  let sliderRef = useRef(null);

  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    variableWidth: true,
    afterChange: (current) => {
      setCurrentSlide(current);
      setProgressIndex(current);
    },
    draggable: true,
    swipe: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  };
  const filteredStories =
    selectedArea === 'All'
      ? success_stories_slider
      : success_stories_slider.filter(
          (story) => story?.node?.successStoriesGroupField?.type?.toString() === selectedArea
        );
  useEffect(() => {
    calculateTotalSlides();
    window.addEventListener('resize', calculateTotalSlides);

    const updateWidth = () => {
      if (window.innerWidth > 750) {
        setProgressWidth(`${((progressIndex + 4) / filteredStories?.length) * 100}%`);
      } else {
        setProgressWidth(`${((progressIndex + 1) / filteredStories?.length) * 100}%`);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('resize', calculateTotalSlides);
    };
  }, [filteredStories, progressIndex, filteredStories?.length, filteredStories]);

  const calculateTotalSlides = () => {
    let slidesToShow = settings.slidesToShow;
    const windowWidth = window.innerWidth;

    settings.responsive?.forEach((breakpoint) => {
      if (windowWidth <= breakpoint.breakpoint) {
        slidesToShow = breakpoint.settings.slidesToShow;
      }
    });

    const total = success_stories_slider?.length - slidesToShow;
    setTotalSlides(total > 0 ? total : 0);
  };

  const handleProgressBarClick = (event) => {
    const clickPosition = event.clientX - event.target.getBoundingClientRect().left;
    const totalWidth = event.target.clientWidth;
    const slideIndex = Math.floor((clickPosition / totalWidth) * 10);
    setProgressIndex(slideIndex);
    sliderRef.slickGoTo(slideIndex);
  };

  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption?.value || 'All');
  };
  const types = [
    ...new Set(
      success_stories_slider?.map((story) =>
        story?.node?.successStoriesGroupField?.type?.toString()
      )
    )
  ].filter(Boolean);

  const options = [
    { value: 'All', label: 'All' },
    ...types.map((type) => ({ value: type, label: type }))
  ];

  return (
    <section
      data-testid="success-stories-slider"
      className={`${bgColor} pt-10  mb-10 overflow-hidden`}
    >
      <div className="w-full max-w-screen-xl lg:px-10 px-5 mx-auto flex sm:flex-wrap sm:flex-row flex-col justify-between items-start md:items-center gap-5 md:gap-5 mb-10">
        <Heading otherClasses="text-brand-royal-blue lg:text-h2 text-h3 font-medium">
          {heading}
        </Heading>
        <div className="relative sm:w-[12rem] w-full">
          {
            !hideFilter ? <SingleSelect
              options={options}
              placeholder="All"
              placeholderColor="#2DABC4"
              iconColor="#2DABC4"
              backgroundColor="#f9f9f9"
              control="1px solid #2DABC4"
              className="sm:w-[12rem] w-full"
              onChange={handleAreaChange}
            /> : null
          }

        </div>
      </div>
      <section
        className={` w-full gap-6 mx-auto max-w-screen-xl lg:px-10 px-5 md:pb-[3.125rem] pb-6 bg-brand-neutral-1`}
      >
        <div className="flex relative">
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
            alt="prev"
            height={48}
            width={48}
            onClick={previous}
            className={`${filteredStories?.length <= 4 ? 'md:hidden block' : 'block'}  ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} absolute z-20 w-[3rem] -left-[1%] h-[3rem] top-[38%]`}
          />
          <Slider
            {...settings}
            className="successStorySlider flex flex-row gap-6"
            ref={(slider) => {
              sliderRef = slider;
            }}
          >
            {filteredStories?.map((story, index) => {
              const { successStoriesGroupField, title, excerpt, slug } = story?.node;
              const { type, image, imagesGallery, video, videoThumbnail } =
                successStoriesGroupField;

              const thumbnail =
                videoThumbnail?.node?.mediaItemUrl && videoThumbnail?.node?.mediaItemUrl;
              const isImage = type?.toString() === 'Image';
              const isVideo = type?.toString() === 'Video';
              const isGallery = type?.toString() === 'Gallery';
              return (
                <Link
                  href={`/success-stories/${slug}`}
                  target="_blank"
                  className="h-full"
                  key={index}
                >
                  <div
                    className={`${isGallery ? `${styles.galleryContainer} bg-brand-white w-full border border-brand-neutral-5 flex sm:flex-row flex-col gap-3` : 'bg-brand-blue max-w-[23.688rem]'} h-full py-8 px-6 mr-6`}
                  >
                    <div className="flex flex-col items-start gap-4 w-fit">
                      {isImage && (
                        <div className="relative w-[20.688rem] h-[12rem]">
                          {isImage && image?.node?.mediaItemUrl && (
                            <Image
                              src={image?.node?.mediaItemUrl}
                              alt="slider-image"
                              fill
                              className="absolute object-cover"
                            />
                          )}
                        </div>
                      )}
                      {isVideo && video && (
                        <div className="relative w-[20.688rem] h-[12rem]">
                          <ReactPlayer
                            url={video.replace(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i, '$1')}
                            width="100%"
                            height="100%"
                            controls={false}
                            // light={thumbnail}
                            playing={false}
                          />

                          <div className="cursor-pointer absolute top-[50%] translate-x-[50%] translate-y-[-50%] right-[50%] flex-shrink-0">
                            <Image
                              src={
                                'https://mclsadmin.3lanemarketing.com/wp-content/uploads/2024/07/Button_-Play.svg'
                              }
                              alt=""
                              width={40}
                              height={40}
                              className="w-[2.875rem] h-[2.875rem]"
                            />
                          </div>
                        </div>
                      )}

                      {isGallery && (
                        <div className="relative max-w-[36.75rem] w-full h-[16rem]">
                          {imagesGallery?.edges?.slice(0, 4)?.map((img, i) => {
                            if (i === 0) {
                              return (
                                <Image
                                  key={i}
                                  src={img?.node?.mediaItemUrl}
                                  alt="slider-image"
                                  fill
                                  className="absolute object-cover max-w-[36.75rem] w-full h-[16rem]"
                                />
                              );
                            }
                          })}
                        </div>
                      )}

                      <Heading
                        otherClasses={`text-[1.5rem] leading-[1.875rem] font-medium ${isGallery ? 'text-brand-royal-blue' : 'text-brand-white'} line-clamp-2`}
                      >
                        {title}
                      </Heading>
                      {!isGallery && <div className="h-[0.063rem] bg-white w-full" />}
                      <HtmlBlock
                        content={excerpt}
                        className="text-p2 text-white font-normal line-clamp-5"
                      />
                      {isGallery && (
                        <Link
                          href={'#'}
                          className="flex justify-center items-center gap-[0.625rem] pb-2 border-b-2 border-brand-green w-fit"
                        >
                          <p className="text-brand-darker text-p4 font-normal">Learn More</p>
                          <Image
                            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
                            alt=""
                            height={16}
                            width={16}
                            className="h-4 w-4"
                          />
                        </Link>
                      )}
                    </div>
                    {isGallery && (
                      <div className="sm:w-[10.5rem] w-auto relative flex sm:flex-col flex-row gap-6">
                        {imagesGallery?.edges?.slice(1, 4)?.map((img, i) => {
                          if (i < 4) {
                            return (
                              <div key={i} className="relative w-[8.5rem] h-[8.5rem] ">
                                <Image
                                  src={img?.node?.mediaItemUrl}
                                  alt="slider-image"
                                  fill
                                  className={`object-cover object-center w-full h-full relative`}
                                />
                                {imagesGallery?.edges?.length > 4 && i === 2 ? (
                                  <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-p4 font-medium w-full h-full bg-black bg-opacity-30 text-white flex items-center justify-center flex-col gap-3 cursor-pointer">
                                    <Image
                                      src={
                                        'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Glyph_-undefined23.svg'
                                      }
                                      width={24}
                                      height={24}
                                      className="w-6 h-6"
                                      alt="plus"
                                    />
                                    {imagesGallery?.edges?.length - 4} Images
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </Slider>
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
            alt="next"
            height={48}
            width={48}
            className={`${filteredStories?.length <= 4 ? 'md:hidden block' : 'block'} ${currentSlide >= totalSlides ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} rotate-180 absolute right-0 z-20 w-[3rem] h-[3rem] top-[38%]`}
            onClick={next}
          />
        </div>
        <div className="max-w-screen-xl w-full mx-auto mt-10">
          <div className="flex md:flex-row flex-col-reverse gap-5">
            {button_anchor?.url && (
              <CustomLink
                anchor={button_anchor}
                variant={button_variant}
                otherClasses="flex flex-none"
              />
            )}
            <div
              className={`relative w-full max-w-screen-xl mx-auto pr-5 flex items-center cursor-pointer`}
              onClick={handleProgressBarClick}
            >
              <div className="overflow-hidden h-[0.5rem] w-full text-xs flex rounded-[0.75rem] bg-brand-neutral-5">
                <div
                  style={{
                    width: progressWidth
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
