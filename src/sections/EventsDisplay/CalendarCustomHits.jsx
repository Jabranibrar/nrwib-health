import { useState, useMemo, useCallback } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { isMobile } from "react-device-detect";
import ReactModal from "react-modal";
import { useRouter } from "next/router";
import dayjs from '@/src/utils/dayjs';
import 'dayjs/locale/es';
import { clsx } from "clsx";
import CalendarEventPopup from "@/src/components/CalendarEventPopup";
import styles from "./EventsDisplay.module.scss";
ReactModal.setAppElement("body");
function getDateTime(date, timeAndAMPM) {
  // Split date and time parts
  const dateParts = date.split('/');
  // Reformat the date into YYYY-MM-DD
  const dateReformatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  let [time, ampm] = timeAndAMPM.split(' ');
  // Convert time to 24-hour format
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  // Adjust hours based on AM/PM
  if (ampm === 'pm' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'am' && hours === 12) {
    hours = 0; // Midnight case
  }

  // Create the full datetime string in ISO 8601 format (YYYY-MM-DDTHH:mm)
  const timeReformatted = `${('0' + hours).slice(-2)}:${minutes}`;
  const fullDateTime = `${dateReformatted}T${timeReformatted}`;

  // Return the new Date object
  return new Date(fullDateTime);
}
function modifyUrl(title, url) {
  if (typeof history.replaceState != "undefined") {
    var obj = {
      Title: title,
      Url: url,
    };
    history.replaceState(obj, obj.Title, obj.Url);
  }
}
export default function CalendarCustomHits({ data }) {
  const [bcView, setBCView] = useState(isMobile ? "week" : "month");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [prevEvent, setPrevEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  let router = useRouter();
  dayjs.locale(router.locale);
  const localizer = dayjsLocalizer(dayjs);
  const messages = useMemo(() => {
    return {
      previous: "Previous",
      next: "Next",
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
    };
  }, [router.locale]);
  const events = useMemo(
    () => data
      ?.map((event) => {
        const { event_date, event_start_time, event_end_time } = event || {};
        return {
          ...event,
          start: getDateTime(event_date, event_start_time),
          end: getDateTime(event_date, event_end_time),
        };
      }),
    [data]
  );
  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event);
    setShowPopup(true);
    const url = router.asPath + event.slug;
    modifyUrl(event.slug, url);
    const currentIndex = events?.findIndex((post) => post.slug === event.slug);
    const prevPost =
      events?.[(currentIndex - 1 + events?.length) % events?.length];
    const nextPost = events?.[(currentIndex + 1) % events?.length];
    setPrevEvent(prevPost);
    setNextEvent(nextPost);
  }, [events]);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    const url = router.asPath.replace(selectedEvent.slug, "");
    modifyUrl("", url);
    //setSelectedEvent(null);
  }, [selectedEvent]);

  const formats = useMemo(
    () => ({
      weekdayFormat: (date, culture, localizer) =>
        localizer?.format(date, "dddd", culture),
      dayFormat: (date, culture, localizer) =>
        localizer?.format(date, "dddd", culture),
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, "hh:mm a", culture),
      monthHeaderFormat: (date, culture, localizer) =>
        localizer?.format(date, "MMMM YYYY", culture),
    }),
    []
  );
  const { components } = useMemo(
    () => ({
      components: {
        event: ({ event }) => {
          return (
            <div
              className="whitespace-normal p-2.5 text-base rounded-xl text-brand-dark-grey lg:text-inherit"
            >
              <p className={"text-brand-dark-grey font-semibold text-sm mb-1"}>{event?.event_start_time}</p>
              <p className={"text-brand-royal-blue font-normal"}>{event?.post_title}</p>
            </div>
          );
        },
      },
    }),
    []
  );

  return (
    <>
      <div className={clsx("mx-4 xl:mx-0", styles.customCalendar)}>
        <Calendar
          events={events}
          view={bcView}
          views={{
            month: true,
            week: true,
            day: true,
            agenda: false,
          }}
          onView={setBCView}
          showAllEvents
          onSelectEvent={handleEventSelect}
          messages={messages}
          formats={formats}
          localizer={localizer}
          components={components}
          showMultiDayTimes
        />
      </div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopup}
        contentLabel="Event Modal"
        preventScroll
        shouldCloseOnEsc
        style={{
          overlay: {
            zIndex: 1000,
            backgroundColor: "rgba(51, 149, 215, 0.50)"
          },
          content: {
            background: "none",
            border: "none",
            inset: "0px",
            padding: "0px",
          },
        }}
      >
        <CalendarEventPopup
          event={selectedEvent}
          prevEvent={prevEvent}
          nextEvent={nextEvent}
          onClose={closePopup}
          handleEventSelect={handleEventSelect}
        />
      </ReactModal>
    </>
  );
}
