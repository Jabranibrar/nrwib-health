import Image from 'next/image'
import EventPopupContent from '@/src/components/EventPopupContent'
import Icon from '@/src/components/Icon';

const CalendarEventPopup = ({ event, prevEvent, nextEvent, onClose, handleEventSelect }) => {
  return (
    <div className='flex items-center w-full min-h-full py-8 lg:py-16 px-4 sm:px-16 bg-white/20 overflow-hidden'>
      <div className='rounded-2xl relative w-full max-w-xl mx-auto bg-white border border-brand-neutral-7 shadow-popup'>
        <EventPopupContent data={event} />
        <div className={"px-8"}>
          <div className='border-t border-brand-saffron flex gap-x-6'>
            <div
              className='w-1/2 py-4  flex items-center cursor-pointer'
              onClick={() => { handleEventSelect(prevEvent) }}
            >
              <Icon
                icon="blue-chevron-right"
                otherClasses="rotate-[-180deg]"
                iconWidth={50}
                iconHeight={50}
              />
              <p className='hidden md:block flex-1 text-brand-dark-gray-0 text-p2'>
                <span className={"font-medium text-base text-brand-blue-sky block"}>Previous</span>
                <span className={"font-medium text-base text-brand-dark-grey"}>{prevEvent?.post_title}</span>
              </p>
            </div>
            <div
              className='w-1/2 py-4 flex items-center justify-end cursor-pointer'
              onClick={() => { handleEventSelect(nextEvent) }}
            >
              <p className='hidden md:block flex-1 text-brand-dark-gray-0 text-p2 text-right'>
                <span className={"font-medium text-base text-brand-blue-sky block"}>Next</span>
                <span className={"font-medium text-base text-brand-dark-grey"}>{nextEvent?.post_title}</span>
              </p>
              <Icon
                icon="blue-chevron-right"
                iconWidth={50}
                iconHeight={50}
              />
            </div>
          </div>
        </div>
        <button onClick={onClose} className='absolute right-6 top-6'>
          <Image src="/images/close-popup.svg" width={38} height={38} alt="Close" />
        </button>
      </div>
    </div>
  )
}

export default CalendarEventPopup
