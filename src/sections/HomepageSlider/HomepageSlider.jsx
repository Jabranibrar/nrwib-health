import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import styles from './HomepageSlider.module.scss';

const HomepageSlider = (props) => {
  const { hero_slides } = props;
  const [currentSlide, setCurrentSlide] = useState(0);

  let sliderRef = useRef(null);

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
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };
  return (
    <section className="bg-brand-royal-blue mb-10 overflow-hidden relative">
      <Image
        src={'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-2-1.svg'}
        alt="icon"
        width={116}
        height={116}
        className="w-[7.25rem] h-[7.25rem] absolute top-0 left-0 z-20"
      />
      <div className="h-[2.875rem] w-full absolute bottom-0 left-0 bg-brand-blue"></div>
      <div className="relative">
        <Image
          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow-1.svg"
          alt="prev"
          height={48}
          width={48}
          onClick={previous}
          className={`absolute z-20 top-[50%] left-[2.5rem] lg:left-4 w-[3rem] h-[3rem] ${currentSlide === 0  ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        />
        <Slider
          {...settings}
          ref={(slider) => {
            sliderRef = slider;
          }}
          className='homePageSlider'
        >
          {Array(hero_slides)
            ?.fill(null)
            ?.map((_,index) => {
              const button = {
                anchor: props[`hero_slides_${index}_button_anchor`],
                variant: props[`hero_slides_${index}_button_variant`]
              }

              return (
                <div
                  className={`mx-auto !flex lg:flex-row flex-col h-full ${styles.homeSectionMargin}`}
                  key={index}
                >
                  <div className="relative lg:py-[5.25rem] py-[6.5rem] lg:pr-6 lg:max-w-[45rem] w-full">
                    <div className={`px-5 lg:px-0 ${button?.anchor?.url ? "" :"flex flex-col justify-center"}`}>
                      <Heading otherClasses={'text-h1 font-semibold text-brand-white mb-4'}>
                        {props[`hero_slides_${index}_heading`]}
                      </Heading>
                      <HtmlBlock
                        className="text-p1 font-normal text-brand-white"
                        content={props[`hero_slides_${index}_text`]}
                      />
                      {button?.anchor?.url && <CustomLink {...button} otherClasses={'mt-[3.625rem]'} />}
                    </div>
                    <div className="h-[2.875rem] w-full absolute bottom-0 bg-brand-blue lg:hidden block" />
                  </div>
                  <div className="relative w-full">
                    <div className="min-h-[32rem] h-full w-full relative overflow-hidden">
                      <Image
                        src={props[`hero_slides_${index}_image`]?.url}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-brand-blue w-[4.5rem] h-full lg:block hidden absolute left-0 z-10 top-[-2.875rem]" />
                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-3.svg"
                      alt="icon"
                      width={116}
                      height={116}
                      className="w-[7.25rem] h-[7.25rem] absolute bottom-0 right-0"
                    />
                  </div>
                </div>
              );
            })}
        </Slider>
        <Image
          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow-1.svg"
          alt="next"
          height={48}
          width={48}
          className={`absolute rotate-180 top-[50%] right-[2.5rem] w-[3rem] h-[3rem] ${
            currentSlide === hero_slides - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={next}
        />
      </div>
    </section>
  );
};

export default HomepageSlider;
