import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import styles from './DateRangeInput.module.scss';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import Icon from '../Icon';

const RenderMonthYearElement = ({ month, onMonthSelect, onYearSelect }) => {
  const min = '2024-01-01',
    max = '2030-01-01';

  const returnYears = () => {
    let years = [];
    for (
      let i = parseInt(moment(min).format('YYYY'));
      i <= parseInt(moment(max).format('YYYY'));
      i++
    ) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return years;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <select
          value={moment(month).isBefore(moment(min)) ? moment(min).month() : month.month()}
          onChange={(e) => onMonthSelect(month, e.target.value)}
        >
          {moment.months().map((label, value) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select value={month.year()} onChange={(e) => onYearSelect(month, e.target.value)}>
          {returnYears()}
        </select>
      </div>
    </div>
  );
};

export const DateRangeInput = ({
                                 startDate,
                                 endDate,
                                 otherClasses,
                                 onDatesChange,
                                 defaultValue,
                                 rootClasses,
                                 handleClear
                               }) => {
  const selectInputClasses = clsx(
    otherClasses,
    'relative whitespace-nowrap flex justify-between items-center text-left w-full border rounded-lg px-3 py-3 border-white text-white'
  );
  const [focusedInput, setFocusedInput] = useState(null);

  const clearDates = useCallback(
    (e) => {
      e.stopPropagation();
      onDatesChange({ startDate: null, endDate: null });
      if (handleClear) handleClear();
    },
    [onDatesChange, handleClear]
  );

  const isDateSelected = !!(startDate || endDate);

  // Handle click on calendar icon
  const openStartDatePicker = () => {
    setFocusedInput('startDate');  // Focus the start date input
  };

  return (
    <div
      data-testid="date-range-input"
      className={clsx(
        rootClasses,
        'relative',
        !startDate ? 'start-date-not-selected' : 'start-date-selected'
      )}
    >
      <div className={clsx(selectInputClasses, styles.customDatePicker)}>
        <DateRangePicker
          startDate={startDate ? moment(startDate) : null}
          startDateId="start_date_id"
          endDate={endDate ? moment(endDate) : null}
          endDateId="end_date_id"
          onDatesChange={onDatesChange}
          renderMonthElement={RenderMonthYearElement}
          focusedInput={focusedInput}
          numberOfMonths={startDate || endDate ? 2 : 1}
          onFocusChange={setFocusedInput}
          isOutsideRange={() => false}
          hideKeyboardShortcutsPanel={true}
          readOnly={true}
          startDatePlaceholderText="Date"
          endDatePlaceholderText=""
          customArrowIcon={endDate ? '-' : ' '}
          startDateAriaLabel="StartDate"
          endDateAriaLabel="EndDate"
          showClearDates={false}
        />
        {isDateSelected ? (
          <Icon icon="cross-icon-white" className="cursor-pointer" onClick={clearDates} />
        ) : (
          <FaCalendarAlt className="cursor-pointer" onClick={openStartDatePicker} />
        )}
      </div>
    </div>
  );
};


export default DateRangeInput;
