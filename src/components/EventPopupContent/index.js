import Heading from '@/src/components/Heading';
import moment from 'moment';
import CustomLink from '@/src/components/CustomLink';
import Icon from '@/src/components/Icon';

export default function EventPopupContent({ data }) {
  const {post_title, event_location, event_date, event_start_time, event_end_time, event_type, register_now_link, slug} = data;
  const regButton = {
    anchor: {
      title: 'Register Now',
      url: register_now_link,
      target: '_blank'
    },
    variant: 16,
  };
  const learnMoreButton = {
    anchor: {
      title: 'Learn More',
      url: `/event/${slug}`,
      target: '_blank'
    },
    variant: 10
  };

  const today = new Date();
  const formattedDate = moment(event_date, 'DD/MM/YYYY h:mm A').format('MMM DD, YYYY'); // Encode event details for the Google Calendar URL
  const dateObj = new Date(moment(event_date, 'DD/MM/YYYY h:mm A'));
  const isPastEvent = dateObj < today;

  // Format the event start and end times to the required Google Calendar format
  const formattedStartTime = moment(`${event_date} ${event_start_time}`, 'DD/MM/YYYY h:mm A').format('YYYYMMDDTHHmmss');
  const formattedEndTime = moment(`${event_date} ${event_end_time}`, 'DD/MM/YYYY h:mm A').format('YYYYMMDDTHHmmss');

  // Encode event details for the Google Calendar URL
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formattedStartTime}%2F${formattedEndTime}&details=${encodeURIComponent(post_title)}&location=${encodeURIComponent(event_location)}&text=${encodeURIComponent(post_title)}`;

  return (
    <div className={`relative h-full py-4 lg:py-7 px-8 min-h-[300px]`}>
      <Heading
        type="h2"
        otherClasses="text-p1 font-manrope font-normal text-brand-royal-blue mb-4 pr-12"
      >
        {post_title}
      </Heading>
      <div className={"my-6 bg-brand-saffron h-[1px] w-full"} />
      <p className={"text-brand-dark-grey font-semibold text-lg mb-3"}>{formattedDate}</p>
      <div className={'text-brand-dark-grey text-lg mb-3'}>
        {event_start_time === event_end_time
          ? 'Full Day'
          : `${event_start_time} - ${event_end_time}`}
      </div>
      {event_location ? <div className={'text-brand-dark-grey text-lg mb-3'}>{`${event_location}`}</div> : null}
      {event_type ? <div className={"bg-brand-neutral-3 py-4 px-9 text-brand-dark-grey-1 text-lg mt-6 -mx-8"}>{event_type}</div> : null}

      <div className={"flex items-center justify-between mt-6"}>
        <CustomLink otherClasses={"!py-3"} {...learnMoreButton} />
        <a className={'group transition-all duration-300 flex gap-2 items-center'}
           target={'_blank'} href={calendarUrl}>
          <span>Add to Calendar</span>
          <Icon
            icon='sky-blue-right-arrow'
            iconHeight={12}
            iconWidth={12}
            className='group-hover:translate-x-2 transition-transform duration-300'
          />
        </a>
      </div>
      { register_now_link && !isPastEvent ? <CustomLink otherClasses={"!py-3 mt-6"} {...regButton} /> : null }
    </div>
  )
}
