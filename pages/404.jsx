import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Layout from '@/src/components/Layout';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import styles from './404.module.scss';
import clsx from 'clsx';
import Head from 'next/head';
import Seo from '@/src/components/Layout/Seo';

const Custom404 = (props) => {
  const { pageNotFound } = props?.data;
 

  const button = {
    anchor: {
      title: pageNotFound?.returnToHomepage?.title,
      url: pageNotFound?.returnToHomepage?.url
    },
    variant: 'primary'
  };

  const seo = {
    title:'404 - Northwest HealthConnect',
    metaDesc:pageNotFound?.text,
    opengraphDescription:pageNotFound?.text,
    opengraphTitle:'404 - Northwest HealthConnect',
    opengraphImage:pageNotFound?.image?.node?.sourceUrl || '',
    opengraphSiteName:'404 - Northwest HealthConnect'
  } 

  return (<>
    <Seo seo={seo} uri={''} />
    <Layout {...props}>
      <div data-testid="404" className="relative">
        <div className="flex md:flex-row flex-col">
          <div className={styles.colorBoxes}>
            <div className="w-full h-[16.2rem] md:h-[26.39rem] bg-brand-blue"></div>
            <div className="w-full h-[16.2rem] bg-brand-neutral-2"></div>
          </div>
          {pageNotFound?.image?.node?.sourceUrl && (
            <div className="w-full relative md:!w-[59.8%] h-[30rem] md:h-auto">
              <Image
                src={pageNotFound?.image?.node?.sourceUrl}
                fill
                priority
                alt="image"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}
        </div>
        <div
          className={clsx(
            styles.textContainer,
            'absolute right-5 min-h-[250px] top-28 flex items-center justify-end md:w-[50%]'
          )}
        >
          <div className="relative w-fit">
            <div className="absolute h-full w-full -left-[1.875rem] -bottom-[1.938rem] !z-0 border border-brand-teal"></div>
            <div className="flex bg-white w-full !py-[3.75rem] px-5 lg:!px-14 flex-col gap-[1.875rem] relative !z-10">
              <Heading otherClasses="text-[2.5rem] leading-[3.125rem] font-semibold text-brand-royal-blue">
                {pageNotFound?.title}
              </Heading>
              <HtmlBlock
                content={pageNotFound?.text}
                className="text-brand-darker text-[1.25rem] leading-[1.875rem] font-normal"
              />
              {button?.anchor?.url && <CustomLink {...button} />}
            </div>
          </div>
        </div>
      </div>
    </Layout></>
  );
};

export default Custom404;

export async function getStaticProps() {
  const siteData = await getSitewideSettings();

  return {

    props: {
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: false
  };
}
