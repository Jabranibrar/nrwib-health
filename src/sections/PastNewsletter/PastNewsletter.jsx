import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';
import Link from 'next/link';
import Loading from '@/src/components/Loading';

const PastNewsletter = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [progressIndex, setProgressIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [progressWidth, setProgressWidth] = useState('');
  let sliderRef = useRef(null);

  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const calculateTotalSlides = () => {
    let slidesToShow = settings.slidesToShow;
    const windowWidth = window.innerWidth;

    settings.responsive.forEach((breakpoint) => {
      if (windowWidth <= breakpoint.breakpoint) {
        slidesToShow = breakpoint.settings.slidesToShow;
      }
    });

    const total = campaigns.length - slidesToShow;
    setTotalSlides(total > 0 ? total : 0);
  };

  useEffect(() => {
    calculateTotalSlides();
    window.addEventListener('resize', calculateTotalSlides);

    const updateWidth = () => {
      if (window.innerWidth > 750) {
        setProgressWidth(`${((progressIndex + 2) / campaigns.length) * 100}%`);
      } else {
        setProgressWidth(`${((progressIndex + 1) / campaigns.length) * 100}%`);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('resize', calculateTotalSlides);
    };
  }, [campaigns, progressIndex, campaigns?.length]);

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

  const handleProgressBarClick = (event) => {
    const clickPosition = event.clientX - event.target.getBoundingClientRect().left;
    const totalWidth = event.target.clientWidth;
    const slideIndex = Math.floor((clickPosition / totalWidth) * campaigns.length);
    setProgressIndex(slideIndex);

    sliderRef.slickGoTo(slideIndex);
  };

  const button = {
    anchor: {
      title: props?.cta?.title,
      url: props?.cta?.url
    },
    variant: 'primary'
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <section className="w-full bg-white" data-testid="past-newsletter">
        <div className="max-w-screen-xl w-full mx-auto lg:px-10 px-5 lg:py-[3.75rem] md:py-10 py-5">
          <div className="lg:pr-[3.5rem] md:pr-[2.5rem]">
            <h2 className="text-brand-royal-blue text-h2 mb-12 text-start font-semibold">
              Past Newsletters
            </h2>
            {campaigns.length == 0 ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                <div className={`relative flex w-full gap-6 mx-auto`}>
                  <Image
                    src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
                    alt="prev"
                    height={48}
                    width={48}
                    onClick={previous}
                    className={`${campaigns?.length == 2 ? 'md:hidden block' : 'block'} absolute z-20 w-[3rem] h-[3rem] left-0 -translate-x-1/2 top-[50%] ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                  <Slider
                    {...settings}
                    ref={(slider) => {
                      sliderRef = slider;
                    }}
                    className="eventsSliderContainer"
                  >
                    {campaigns.length > 0 &&
                      campaigns?.map((campaign, index) => {
                        const { title, url, date, image } = campaign;
                        const dateObj = new Date(date);

                        const formattedDate = dateObj.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        });
                        return (
                          <div className="pr-6 !h-full" key={index}>
                            <Link href={url} target={'_blank'}>
                              <div className="border border-brand-neutral-5 py-8 px-6 w-full min-w-[24rem] min-h-[inherit] h-full">
                                <div className="w-full flex flex-col justify-between max-w-[24rem] min-h-[inherit] h-full">
                                  <div>
                                    <div className="w-full h-[18rem] relative mb-4">
                                      <Image
                                        src={image || '/images/Nrwib-health-logo.svg'}
                                        alt="event"
                                        fill
                                        className="object-contain bg-center"
                                      />
                                    </div>
                                    <Heading className="text-[1.5rem] leading-[1.875rem] font-bold mb-3 text-brand-royal-blue line-clamp-2">
                                      {title}
                                    </Heading>
                                  </div>
                                  <p className="text-brand-darker text-p4 font-normal">
                                    {formattedDate}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                  </Slider>
                  <Image
                    src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
                    alt="next"
                    height={48}
                    width={48}
                    className={`${campaigns.length == 2 ? 'md:hidden block' : 'block'} rotate-180 absolute right-0 z-20 w-[3rem] h-[3rem] translate-x-1/2 top-[50%] ${
                      currentSlide >= totalSlides
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    onClick={next}
                  />
                </div>
                <div className="mt-10 flex gap-[17px] justify-center items-start md:items-center md:flex-row flex-col-reverse">
                  {button?.anchor && <CustomLink {...button} otherClasses={'min-w-fit'} />}
                  <div className="relative w-full cursor-pointer" onClick={handleProgressBarClick}>
                    <div className="overflow-hidden h-[6px] w-full text-xs flex rounded-[0.75rem] bg-brand-neutral-5">
                      <div
                        style={{
                          width: progressWidth
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green"
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PastNewsletter;
