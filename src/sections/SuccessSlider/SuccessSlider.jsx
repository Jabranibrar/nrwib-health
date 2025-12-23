import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Slider from 'react-slick';

export default function SuccessSlider(data) {
  const { button_variant, button_anchor, slider } = data;

  let sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    sliderRef.slickNext();
    setCurrentSlide(currentSlide + 1);
  };
  const previous = () => {
    sliderRef.slickPrev();
    setCurrentSlide(currentSlide - 1);
  };

  const handleProgressBarClick = (event) => {
    const clickPosition = event.clientX - event.target.getBoundingClientRect().left;
    const totalWidth = event.target.clientWidth;
    const slideIndex = Math.floor((clickPosition / totalWidth) * slider.length);
    setCurrentSlide(slideIndex);
    sliderRef.slickGoTo(slideIndex);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => {
      setCurrentSlide(current);
    },
    adaptiveHeight: true
  };

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section data-testid="success-slider" className="bg-brand-neutral py-14 mb-10">
      <div className="max-w-screen-xl lg:px-10 px-5 mx-auto relative">
        <div className="flex items-center justify-center gap-2 md:gap-5 lg:gap-10">
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Group-1261152141.svg"
            alt="arrow-left"
            height={48}
            width={48}
            onClick={previous}
            className={clsx(
              currentSlide === 0 && 'cursor-not-allowed opacity-60',
              'h-12 w-12 md:static absolute left-0 top-[40%] z-20'
            )}
          />

          <div className="!overflow-hidden">
            <Slider
              {...settings}
              ref={(slider) => {
                sliderRef = slider;
              }}
            >
              {slider?.map((item, i) => {
                const mediaType = item?.node?.successStoriesGroupField?.type[0];
                const slug = item.node.slug;

                return (
                  <Link
                    href={`/success-stories/${slug}`}
                    target="_blank"
                    key={i}
                    className="pl-1 overflow-hidden"
                  >
                    {mediaType === 'Video' && (
                      <div className="md:h-[28rem] sm:h-[16rem] xs:h-[14rem] h-[12rem] w-full relative">
                        <ReactPlayer
                          controls={false}
                          url={item?.node?.successStoriesGroupField?.video?.replace(
                            /<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i,
                            '$1'
                          )}
                          width="100%"
                          height="100%"
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
                    {mediaType === 'Image' && (
                      <div className="md:h-[28rem] sm:h-[16rem] xs:h-[14rem] h-[12rem] w-full relative">
                        <Image
                          src={item?.node?.successStoriesGroupField?.image?.node?.mediaItemUrl}
                          alt="image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {mediaType === 'Gallery' && (
                      <div className="flex flex-col md:flex-row gap-5 lg:gap-[1.938rem]">
                        <div className="relative w-full max-w-[59.35rem] md:h-[28rem] sm:h-[16rem] xs:h-[14rem] h-[12rem]">
                          <Image
                            src={
                              item?.node?.successStoriesGroupField?.imagesGallery?.edges[0]?.node
                                ?.mediaItemUrl
                            }
                            alt="main-image"
                            className="object-cover"
                            fill
                          />
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 md:gap-4 md:w-fit w-full">
                          {item?.node?.successStoriesGroupField?.imagesGallery?.edges
                            .slice(1, 4)
                            .map((gallery, i) => {
                              const remainingImages =
                                item?.node?.successStoriesGroupField?.imagesGallery?.edges.length -
                                4;
                              const checkLast =
                                i ===
                                item?.node?.successStoriesGroupField?.imagesGallery?.edges.length -
                                  2;

                              return (
                                <div className="h-[8.7rem] w-[31vw] md:w-[12rem] lg:w-[16.7rem] relative">
                                  <Image
                                    src={gallery?.node?.mediaItemUrl}
                                    alt="side-image"
                                    fill
                                    className="object-cover"
                                  />
                                  {checkLast && remainingImages > 0 && (
                                    <div className="absolute h-full w-full gap-3 flex flex-col justify-center items-center bg-[#1111114d]">
                                      <Image
                                        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Glyph_-undefined.svg"
                                        alt="plus"
                                        height={24}
                                        width={24}
                                        className="h-6 w-6"
                                      />

                                      <p className="text-p4 font-medium text-white">
                                        {remainingImages} Images
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    <Heading otherClasses="text-h3 font-semibold mt-5 text-brand-dark-grey">
                      {item?.node?.title}
                    </Heading>
                  </Link>
                );
              })}
            </Slider>
          </div>

          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Group-1261152142.svg"
            alt="arrow-right"
            height={48}
            width={48}
            onClick={next}
            className={clsx(
              currentSlide === slider.length - 1 && 'cursor-not-allowed opacity-60',
              'h-12 w-12 md:static absolute right-0 top-[40%] z-20'
            )}
          />
        </div>
        <div className="w-full md:max-w-[85%] lg:max-w-[86%] xl:max-w-[88%] mx-auto mt-5 flex md:flex-row flex-col justify-center items-start md:items-center gap-[1.063rem]">
          {button?.anchor && <CustomLink {...button} otherClasses="md:text-nowrap text-wrap" />}
          <div
            className={`relative w-full flex items-center cursor-pointer`}
            onClick={handleProgressBarClick}
          >
            <div className="overflow-hidden h-[0.375rem] w-full text-xs flex rounded-[2.5rem] bg-brand-neutral-5">
              <div
                style={{
                  width: `${((currentSlide + 1) / slider.length) * 100}%`
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
