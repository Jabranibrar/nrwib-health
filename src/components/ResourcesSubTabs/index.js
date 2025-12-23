import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';
import Heading from '@/src/components/Heading';
import Image from 'next/image';
import NextLink from '@/src/components/NextLink';
import NextImage from '@/src/components/NextImage';
import VideoCards from '@/src/sections/VideoCards/VideoCards';
import AudioFiles from '@/src/sections/AudioFiles/AudioFiles';

export default function ResourcesSubTabs({ data }) {
  const categorizedResources = data.reduce((acc, resource) => {
    const { resourceType } = resource.resourcesFieldGroup;
    if (!acc[resourceType]) acc[resourceType] = [];
    acc[resourceType].push(resource);
    return acc;
  }, {});
  const [activeTab, setActiveTab] = useState(Object.keys(categorizedResources)[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Helpful Links':
        return (
          <>
            <section
              className="w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10"
              data-testid="helpful-links"
            >
              {categorizedResources[activeTab]?.map((resource, index, arr) => {
                const isLast = index === arr.length - 1;

                return resource?.resourcesFieldGroup?.url ? (
                  <Link
                    rel="noopener noreferrer"
                    target={'_blank'}
                    href={resource?.resourcesFieldGroup.url}
                  >
                    <div
                      key={index}
                      className={`bg-brand-neutral-3 hover:bg-brand-dark-grey/10 transition-all duration-300 w-full py-6 px-9 gap-5 flex justify-between items-center ${
                        isLast ? '' : 'mb-4'
                      }`}
                    >
                      <Heading className="text-brand-royal-blue text-p1 font-medium">
                        {resource?.title}
                      </Heading>

                      <Image
                        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/link-4-1.svg"
                        alt="link-icon"
                        width={24}
                        height={24}
                        className="min-h-6 min-w-6"
                      />
                    </div>
                  </Link>
                ) : (
                  <div
                    key={index}
                    className={`bg-brand-neutral-3 w-full py-6 px-9 gap-5 flex justify-between items-center ${
                      isLast ? '' : 'mb-4'
                    }`}
                  >
                    <Heading className="text-brand-royal-blue text-p1 font-medium">
                      {resource?.title}
                    </Heading>

                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/link-4-1.svg"
                      alt="link-icon"
                      width={24}
                      height={24}
                      className="min-h-6 min-w-6"
                    />
                  </div>
                );
              })}
            </section>
          </>
        );
      case 'PDFs':
        return (
          <>
            <section className="container my-10">
              <div className="flex flex-wrap items-center justify-center gap-x-4">
                {categorizedResources[activeTab]?.map((resource, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const browseKnowledgeTags = resource?.browseKnowledgeTags.nodes
                    .map((node) => node.name)
                    .join(', ');
                  return (
                    <NextLink
                      href={resource?.resourcesFieldGroup?.uploadFile?.node?.mediaItemUrl}
                      otherClasses="w-[32%] p-5 bg-brand-neutral-3 hover:bg-brand-neutral-5 transition-all duration-200 ease-in border border-brand-neutral-5"
                      key={index}
                    >
                      <div className="relative">
                        {browseKnowledgeTags && (
                          <div className="absolute top-2 left-2 p-2 bg-brand-blue rounded-lg text-white">
                            {browseKnowledgeTags}
                          </div>
                        )}
                        <NextImage
                          height={1000}
                          width={1000}
                          url={resource?.resourcesFieldGroup?.uploadFile?.node?.sourceUrl}
                          alt=""
                          otherClasses="object-cover h-[393px]"
                        />
                      </div>
                      <Heading
                        type="h3"
                        otherClasses="font-manrope text-brand-royal-blue font-medium mt-5 mb-10"
                      >
                        {resource?.title}
                      </Heading>
                      <NextImage
                        height={50}
                        width={50}
                        url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/download-pdf-button.svg"
                        alt=""
                      />
                    </NextLink>
                  );
                })}
              </div>
            </section>
          </>
        );
      case 'Videos':
        const videos = categorizedResources[activeTab];
        const dynamicVideoCards = {};

        videos.forEach((video, i) => {
          dynamicVideoCards[`video_cards_${i}_video_url`] = video?.resourcesFieldGroup?.videoUrl;
          dynamicVideoCards[`video_cards_${i}_title`] = video?.title;
          dynamicVideoCards[`video_cards_${i}_text`] = video?.resourcesFieldGroup?.videoDescription;
        });

        return (
          <>
            <VideoCards {...dynamicVideoCards} showPopup={true} />
          </>
        );
      case 'Audio Files':
        const audios = categorizedResources[activeTab];
        const dynamicAudioFiles = {};

        audios.forEach((audio, i) => {
          dynamicAudioFiles[`audio_cards_${i}_media_url`] = audio?.resourcesFieldGroup?.mediaUrl;
          dynamicAudioFiles[`audio_cards_${i}_title`] = audio?.title;
        });
        return (
          <>
            <AudioFiles {...dynamicAudioFiles} />
          </>
        );
    }
  };
  return (
    <section data-testid="sub-tabs" className="w-full mb-10">
      <div className="w-full max-w-screen-xl lg:px-10 px-5 pb-6 mx-auto">
        <div className="flex flex-wrap justify-center items-center mb-6">
          {Object.keys(categorizedResources).map((category, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(category)}
              className={clsx(
                activeTab === category
                  ? 'text-white bg-brand-blue-sky'
                  : 'text-brand-blue-sky bg-white',
                'border border-brand-blue-sky text-p2 font-normal tracking-[0.006rem] py-4 px-10 w-full sm:w-fit text-center'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* SubTabs Content */}
        <div className="w-full mt-16">{renderTabContent()}</div>
      </div>
    </section>
  );
}
