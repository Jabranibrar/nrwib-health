import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const ImageWithTopics = (props) => {
  const { heading, image } = props;
  const topics = Array(props.topics || 0)
    .fill(null)
    .map((_, i) => {
      return {
        title: props[`topics_${i}_title`],
        content: props[`topics_${i}_content`]
      };
    });
  return (
    <section
      className="bg-brand-royal-blue flex relative overflow-hidden"
      data-testid="image-with-topics"
    >
      <div className="container py-10">
        <div className="lg:w-[60%]">
          <Heading
            type="h2"
            otherClasses="text-h2 lg:text-h1 font-manrope font-medium text-white pb-5 border-b border-b-white"
          >
            {heading}
          </Heading>
          {topics.map((topic, i) => {
            const isLast = i === topics.length - 1;
            return (
              <div className={`mt-5 pb-3 ${!isLast ? 'border-b border-b-white' : ''}`} key={i}>
                <div className="text-p1 font-manrope font-semibold text-white">{topic.title}</div>
                <HtmlBlock
                  content={topic.content}
                  className="text-p2 font-manrope font-normal text-white"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-[30%] absolute top-0 right-0 lg:!block hidden">
        <NextImage {...image} otherClasses="min-h-[720px] w-full object-cover object-center" />
      </div>
    </section>
  );
};

export default ImageWithTopics;
