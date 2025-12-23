import CardsWithIcons from '@/src/sections/CardsWithIcons';
import CTABanner1 from '@/src/sections/CTABanner1/CTABanner1';
import CtaBanner3 from '@/src/sections/CtaBanner3';
import CtaBanner4 from '@/src/sections/CtaBanner4';
import CTABanner5 from '@/src/sections/CTABanner5/CTABanner5';
import CTABanner6 from '@/src/sections/CTABanner6/CTABanner6';
import CtaDoubleCta from '@/src/sections/CtaDoubleCta/CtaDoubleCta';
import GreenAccentWithLeftImageAndRightContent from '@/src/sections/GreenAccentWithLeftImageAndRightContent';
import HeroBanner from '@/src/sections/HeroBanner';
import IconWithContent from '@/src/sections/IconWithContent';
import ImageWithIconTopics from '@/src/sections/ImageWithIconTopics';
import ImageWithText1 from '@/src/sections/ImageWithText1';
import ImageWithText2 from '@/src/sections/ImageWithText2';
import ImageWithTopics from '@/src/sections/ImageWithTopics';
import NavigationTab from '@/src/sections/NavigationTab';
import NewsListing from '@/src/sections/NewsListing';
import StatsBlock from '@/src/sections/StatsBlock/StatsBlock';
import TeamsListing from '@/src/sections/TeamsListing';
import TileCta from '@/src/sections/TileCta';
import YellowAccentWithTextAndImage from '@/src/sections/YellowAccentWithTextAndImage';
import MemberCards from '@/src/sections/MemberCards';
import CTALists from '@/src/sections/CTALists/CTALists';
import CTABanner2 from '@/src/sections/CTABanner2/CTABanner2';
import TabsNavigation from '@/src/sections/TabsNavigation/TabsNavigation';
import BecomeAnIndustryPartner from '@/src/sections/BecomeAnIndustryPartner';
import HomepageSlider from '@/src/sections/HomepageSlider/HomepageSlider';
import MapImage from '@/src/sections/MapImage';
import ResourcesListing from '@/src/sections/ResourcesListing';
import FindASpeaker from '@/src/sections/FindASpeaker/FindASpeaker';
import GlobalSearch from '@/src/sections/GlobalSearch/GlobalSearch';
import SubTabs from '@/src/sections/SubTabs/SubTabs';
import SectionRichTextEditor from '@/src/sections/SectionRichTextEditor/SectionRichTextEditor';
import ContactUsForm from '@/src/sections/ContactUsForm';
import MemberLoginForm from '@/src/sections/MemberLoginForm';
import EventsSlider from '@/src/sections/EventsSlider/EventsSlider';
import NewsSlider from '@/src/sections/NewsSlider/NewsSlider';
import SuccessStoriesListing from '@/src/sections/SuccessStoriesListing';
import FeaturedVideos from '@/src/sections/FeaturedVideos';
import EventsCards from '@/src/sections/EventsCardSection/EventsCardSection';
import RegisterCTA from '@/src/sections/RegisterCTA/RegisterCTA';
import EventsIntroSection from '@/src/sections/EventsIntroSection/EventsIntroSection';
import EventsHeroBanner from '@/src/sections/EventsHeroBanner/EventsHeroBanner';
import MemberForgotForm from '@/src/sections/MemberForgotForm';
import CTABanner7 from '@/src/sections/CTABanner7/CTABanner7';
import MemberUpdatePasswordForm from '@/src/sections/MemberUpdatePasswordForm';
import MemberAccountSettingsForm from '@/src/sections/MemberAccountSettingsForm';
import MemberAccountsNav from '@/src/sections/MemberAccountsNav';
import SectionRichTextOnly from '@/src/sections/SectionRichTextOnly';
import InPageVideo from '@/src/sections/InPageVideo';
import PdfGrid from '@/src/sections/PdfGrid';
import SuccessStoriesSlider from '@/src/sections/SuccessStoriesSlider/SuccessStoriesSlider';
import AccordionSection from '@/src/sections/AccordionSection/AccordionSection';
import VideoCards from '@/src/sections/VideoCards/VideoCards';
import ExpressInterestForm from '@/src/sections/ExpressInterestForm/ExpressInterestForm';
import HelpFulLinks from '@/src/sections/HelpfulLinks/HelpfulLinks';
import FeedbackSurvey from '@/src/sections/FeedbackSurvey/FeedbackSurvey';
import MemberPortalDashboardWidget from '@/src/sections/MemberPortalDashboardWidget';
import BrowseKnowledgeListing from '@/src/sections/BrowseKnowledgeListing';
import AudioFiles from '@/src/sections/AudioFiles/AudioFiles';
import clsx from 'clsx';
import CTABanner8 from '@/src/sections/CTABanner8/CTABanner8';
import ActionTeamWidget from '@/src/sections/ActionTeamWidget/ActionTeamWidget';
import EventsDisplay from '@/src/sections/EventsDisplay/EventsDisplay';
import { AnnouncementsWidget } from '@/src/sections/AnnouncementsWidget';
import MemberResetPasswordForm from '@/src/sections/MemberResetPasswordForm';
import SubscribeForm from '@/src/sections/SubscribeForm';
import PastNewsletter from '@/src/sections/PastNewsletter';
import SuccessSlider from '@/src/sections/SuccessSlider/SuccessSlider';
import JoinActionTeamCTA from '@/src/sections/JoinActionTeamCTA';
import ActionTeamForm from '@/src/sections/ActionTeamForm';
import RichTextWithHeading from '@/src/sections/RichTextWithHeading/RichTextWithHeading';

export const BlockRenderer = ({ blocks = [], className = '' }) => {
  // Define a mapping of block names to their respective components
  const blockComponents = {
    'acf/herobanner': HeroBanner,
    'acf/navigationtab': NavigationTab,
    'acf/imagewithtext1': ImageWithText1,
    'acf/imagewithtext2': ImageWithText2,
    'acf/cardswithicons': CardsWithIcons,
    'acf/ctabanner3': CtaBanner3,
    'acf/ctabanner4': CtaBanner4,
    'acf/tilecta': TileCta,
    'acf/yellowaccentwithtextandimage': YellowAccentWithTextAndImage,
    'acf/greenaccentwithleftimageandrightcontent': GreenAccentWithLeftImageAndRightContent,
    'acf/iconwithcontent': IconWithContent,
    'acf/imagewithicontopics': ImageWithIconTopics,
    'acf/imagewithtopics': ImageWithTopics,
    'acf/teamslisting': TeamsListing,
    'acf/newslisting': NewsListing,
    'core/block': Pattern,
    'acf/ctadoublecta': CtaDoubleCta,
    'acf/sectionstatsblock': StatsBlock,
    'acf/ctabanner1': CTABanner1,
    'acf/sectionmembercards': MemberCards,
    'acf/ctabanner5': CTABanner5,
    'acf/ctabanner6': CTABanner6,
    'acf/ctabanner7': CTABanner7,
    'acf/ctabanner8': CTABanner8,
    'acf/ctalists': CTALists,
    'acf/ctabanner2': CTABanner2,
    'acf/tabsnavigation': TabsNavigation,
    'acf/becomeanindustrypartner': BecomeAnIndustryPartner,
    'acf/homepageslider': HomepageSlider,
    'acf/mapimage': MapImage,
    'acf/resourceslisting': ResourcesListing,
    'acf/sectionspeakercalls': FindASpeaker,
    'acf/globalsearchitemresults': GlobalSearch,
    'acf/navigationsubtabs': SubTabs,
    'acf/richtexteditior': SectionRichTextEditor,
    'acf/contactusform': ContactUsForm,
    'acf/loginform': MemberLoginForm,
    'acf/eventsslider': EventsSlider,
    'acf/newsslider': NewsSlider,
    'acf/successstorieslisting': SuccessStoriesListing,
    'acf/registercta': RegisterCTA,
    'acf/eventsintrosection': EventsIntroSection,
    'acf/sectionvideogallery': FeaturedVideos,
    'acf/sectioneventscards': EventsCards,
    'acf/eventsherobanner': EventsHeroBanner,
    'acf/forgot-password-form': MemberForgotForm,
    'acf/updatepassword-form': MemberUpdatePasswordForm,
    'acf/accountsettings-form': MemberAccountSettingsForm,
    'acf/accountnav': MemberAccountsNav,
    'acf/rich-text-only': SectionRichTextOnly,
    'acf/inpagevideo': InPageVideo,
    'acf/pdf-grid': PdfGrid,
    'acf/successstoriesslider': SuccessStoriesSlider,
    'acf/sectionaccordion': AccordionSection,
    'acf/sectionvideocards': VideoCards,
    'acf/expressinterestform': ExpressInterestForm,
    'acf/helpfullinks': HelpFulLinks,
    'acf/feedbacksurveyform': FeedbackSurvey,
    'acf/memberportalwidget': MemberPortalDashboardWidget,
    'acf/browseknowledgelisting': BrowseKnowledgeListing,
    'acf/sectionaudiofiles': AudioFiles,
    'acf/actionteamswdiget': ActionTeamWidget,
    'acf/events-display': EventsDisplay,
    'acf/announcements-widget': AnnouncementsWidget,
    'acf/reset-member-password-form': MemberResetPasswordForm,
    'acf/subscribeformwidget': SubscribeForm,
    'acf/pastnewsletterwidget': PastNewsletter,
    'acf/successslider': SuccessSlider,
    'acf/joinactionteamcta': JoinActionTeamCTA,
    'acf/joinanactionteamform': ActionTeamForm,
    'acf/richtexteditorwithheading': RichTextWithHeading
  };

  return (
    <div className={clsx('flex flex-col', className)}>
      {blocks.map((block) => {
        const BlockComponent = blockComponents[block.name];
        return (
          BlockComponent && (
            <BlockComponent key={block?.id} block={block} {...block?.attributes?.data} />
          )
        );
      })}
    </div>
  );
};

const Pattern = ({ block }) => {
  if (block.innerBlocks.length) {
    return <BlockRenderer key={block?.id} blocks={block.innerBlocks} />;
  }

  return undefined;
};
