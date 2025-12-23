import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Heading from '@/src/components/Heading';
import styles from './NewsSlider.module.scss';
import CustomLink from '@/src/components/CustomLink';
import Link from 'next/link';

const NewsSlider = (props) => {
  const { news, heading, button_anchor, button_variant } = props;
  let sliderRef = useRef(null);
  const [progressIndex, setProgressIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [progressWidth, setProgressWidth] = useState('');

  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    variableWidth: true,
    afterChange: (current) => {
      setCurrentSlide(current);
      setProgressIndex(current);
    },
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
  useEffect(() => {
    calculateTotalSlides();
    window.addEventListener('resize', calculateTotalSlides);

    const updateWidth = () => {
      if (window.innerWidth > 750) {
        setProgressWidth(`${((progressIndex + 4) / news?.length) * 100}%`);
      } else {
        setProgressWidth(`${((progressIndex + 1) / news?.length) * 100}%`);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('resize', calculateTotalSlides);
    };
  }, [news, progressIndex, news?.length]);

  const calculateTotalSlides = () => {
    let slidesToShow = settings.slidesToShow;
    const windowWidth = window.innerWidth;

    settings.responsive.forEach((breakpoint) => {
      if (windowWidth <= breakpoint.breakpoint) {
        slidesToShow = breakpoint.settings.slidesToShow;
      }
    });

    const total = news?.length - slidesToShow;
    setTotalSlides(total > 0 ? total : 0);
  };

  const handleProgressBarClick = (event) => {
    const clickPosition = event.clientX - event.target.getBoundingClientRect().left;
    const totalWidth = event.target.clientWidth;
    const slideIndex = Math.floor((clickPosition / totalWidth) * 10);
    setProgressIndex(slideIndex);
    sliderRef.slickGoTo(slideIndex);
  };

  return (
    <section className="w-full mb-10 relative overflow-hidden" data-testid="news-slider">
      <div className="max-w-screen-xl lg:px-10 px-5 mx-auto mb-10">
        <Heading className={`text-brand-royal-blue text-h2 capitalize font-medium`}>
          {heading}
        </Heading>
      </div>
      <div
        className={`relative flex w-full gap-6 mx-auto max-w-screen-xl lg:px-10 px-5  ${styles.newsSliderSection}`}
      >
        <Image
          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
          alt="prev"
          height={48}
          width={48}
          onClick={previous}
          className={`${news?.length == 2 ? 'md:hidden block' : 'block'}  ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} absolute z-20 w-[3rem] left-[1%] h-[3rem] ${styles.buttonStyle}`}
        />
        <Slider
          {...settings}
          ref={(slider) => {
            sliderRef = slider;
          }}
          className="newsSliderContainer"
        >
          {news?.map((data, index) => {
            const { content, date, title, featuredImage, newsAdditionalInformation, slug } = data?.node;
            const pdf = newsAdditionalInformation?.pdf?.node?.mediaItemUrl;
            const pdfThumbnail = `${pdf}.png`;
            const isFeaturedImage = featuredImage?.node?.url;
            const dateObj = new Date(date);

            const formattedDate = dateObj.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });
            return (
              <div className="h-full relative w-full min-w-[24rem] mr-6" key={index}>
                <div className="bg-brand-neutral-3 p-6 !flex flex-col justify-between  max-w-[24rem] h-full">
                  {pdf ? (
                    <Link href={pdf} target="_blank" className="w-full">
                      <Image
                        src={
                          pdfThumbnail ||
                          'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Client-TeamName.svg'
                        }
                        alt="news"
                        width={336}
                        height={393}
                        className="w-[21rem] h-[24.563rem] object-cover mb-6"
                      />
                      <Heading className="text-[1.5rem] leading-[1.875rem] font-bold mb-3 text-brand-royal-blue line-clamp-2">
                        {title}
                      </Heading>
                    </Link>
                  ) : (
                    <Link href={`/news/${slug}`} target='_blank' className="w-full">
                      <Image
                        src={
                          isFeaturedImage ||
                          'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Client-TeamName.svg'
                        }
                        alt="news"
                        width={336}
                        height={393}
                        className="w-[21rem] h-[16rem] object-contain bg-brand-neutral-3 bg-center mb-6"
                      />
                      <Heading className="text-[1.5rem] leading-[1.875rem] font-bold mb-3 text-brand-royal-blue line-clamp-2">
                        {title}
                      </Heading>
                    </Link>
                  )}
                  <p className="text-brand-darker text-p4 font-normal">{formattedDate}</p>
                </div>
              </div>
            );
          })}
        </Slider>
        <Image
          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
          alt="next"
          height={48}
          width={48}
          className={`${news?.length == 2 ? 'md:hidden block' : 'block'} ${
            (currentSlide + 4 ) >= totalSlides ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
          } rotate-180 absolute right-5 z-20 w-[3rem] h-[3rem] ${styles.buttonStyle}`}
          onClick={next}
        />
      </div>
      <div className="max-w-screen-xl lg:px-10 px-5 mx-auto mt-10">
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
  );
};

export default NewsSlider;
