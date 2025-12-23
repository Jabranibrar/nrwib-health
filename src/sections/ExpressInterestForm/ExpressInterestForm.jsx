import React, { useEffect, useRef, useState } from 'react';
import { Formik, Field } from 'formik';
import SingleSelect from '@/src/components/SingleSelect';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './ExpressInterestForm.module.scss';
import Heading from '@/src/components/Heading';
import CustomLink from '@/src/components/CustomLink';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import ReactInputMask from 'react-input-mask';

function ExpressInterestForm(props) {
  const {
    heading,
    contact_field_title,
    booking_field_title,
    about_field_title,
    days_of_week_label,
    email_label,
    first_name_label,
    grade_label,
    last_name_label,
    number_of_students_label,
    phone_number_label,
    preferred_speaker_label,
    school_name_label,
    title_label,
    admin_email,
    thank_you_button_anchor,
    thank_you_button_variant,
    thank_you_message
  } = props;
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const mainContainerRef = useRef();
  const formikRef = useRef();

  const speakers = props.speakers;

  const searchParams = useSearchParams();
  const speakerFromURL = searchParams.get('speaker');

  useEffect(() => {
    if (speakerFromURL && speakers.length > 0) {
      const matchingSpeaker = speakers.find((team) => team.title === speakerFromURL);

      if (matchingSpeaker) {
        formikRef.current.setFieldValue('preferredSpeaker', matchingSpeaker.title);
      }
    }
  }, [speakerFromURL, speakers]);

  const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    const unitId = 'wpcf7-f5600-o1';
    const uniqueId = uuidv4().slice(0, 4);
    const subject = `Speaker Booking Form Submission #${uniqueId}`;

    const timeSlotsString = Object.entries(values.timeSlots)
      .map(([day, timeSlot]) => `${day}: ${timeSlot}`)
      .join('\n');

    const updatedValues = {
      ...values,
      _wpcf7_unit_tag: unitId,
      subject,
      admin_email,
      days: values.days.join(', '),
      timeSlots: timeSlotsString,
      grades: values?.grades?.replace(/,\s+/g, ',')
    };

    try {
      await axios.post('/api/expressInterestForm', updatedValues);
      setFormStatus('success');
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    } finally {
      setSubmitting(false);
      setLoading(false);
      scrollUp();
    }
  };

  useEffect(() => {
    if (formStatus === 'success' && mainContainerRef?.current) {
      mainContainerRef.current.scrollIntoView();
    }
  }, [formStatus]);

  const button = {
    anchor: thank_you_button_anchor,
    variant: thank_you_button_variant
  };

  const expressInterestFormCLasses =
    'relative w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10 mt-12';
  return (
    <>
      <section
        className={expressInterestFormCLasses}
        data-testid="express-interest-form"
        ref={mainContainerRef}
      >
        <div className="bg-brand-teal w-full pb-10">
          <h1 className=" pt-11 pl-10 pb-9 text-brand-white text-h2 font-medium">{heading}</h1>
          <Formik
            innerRef={formikRef}
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: null,
              title: '',
              schoolName: '',
              numberOfStudents: '',
              grades: '',
              days: [],
              timeSlots: [],
              preferredSpeaker: speakerFromURL ? speakerFromURL : ''
            }}
            validate={(values) => {
              const errors = {};

              // Validate first name
              if (!values.firstName) {
                errors.firstName = 'Required';
              }

              // Validate last name
              if (!values.lastName) {
                errors.lastName = 'Required';
              }

              // Validate email
              if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
              }

              // Validate phone number
              if (!values.phoneNumber) {
                errors.phoneNumber = 'Required';
              }

              // Validate title
              if (!values.title) {
                errors.title = 'Required';
              }

              // Validate school name
              if (!values.schoolName) {
                errors.schoolName = 'Required';
              }

              // Validate number of students
              if (!values.numberOfStudents) {
                errors.numberOfStudents = 'Required';
              }

              // Validate grades
              if (!values.grades) {
                errors.grades = 'Required';
              }

              return errors;
            }}
            onSubmit={handleSubmitForm}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              onChange = { handleChange },
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
              <form onSubmit={handleSubmit} className="bg-brand-teal">
                <div className="w-full flex flex-col px-10 mb-5">
                  {formStatus === 'success' ? (
                    <div className="py-16 lg:px-10 px-5 bg-white flex justify-center items-center flex-col">
                      <Image
                        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Secondary_Stacked_FullColor-1.svg"
                        alt="logo image"
                        height={121}
                        width={309}
                        className="h-[7.563rem] w-[19.313rem]"
                      />
                      <Heading otherClasses="text-brand-royal-blue text-h2 font-semibold mt-8 text-center">
                        {thank_you_message}
                      </Heading>
                      <CustomLink {...button} otherClasses="mt-[4rem]" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-brand-white py-8 sm:px-14 px-7 mb-10 ">
                        <h1 className="font-bold text-brand-royal-blue text-h4 pb-5">
                          {contact_field_title}
                        </h1>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between mb-6">
                          <div className="flex-1 relative">
                            <label
                              htmlFor="firstName"
                              className="mb-2 text-p2 font-medium text-brand-black-200"
                            >
                              {first_name_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="mt-2 peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 font-light placeholder:text-brand-black-200  bg-brand-neutral-3"
                              required
                              placeholder="Enter First Name"
                            />
                            {errors.firstName && touched.firstName && (
                              <div className="text-brand-warning">{errors.firstName}</div>
                            )}
                          </div>

                          <div className="flex-1 relative">
                            <label
                              htmlFor="lastName"
                              className="text-p2 font-medium brand-black-200"
                            >
                              {last_name_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={values.lastName}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter Last Name"
                            />
                            {errors.lastName && touched.lastName && (
                              <div className="text-brand-warning">{errors.lastName}</div>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between">
                          <div className="flex-1 relative">
                            <label
                              htmlFor="email"
                              className="text-p2 font-medium text-brand-black-200  "
                            >
                              {email_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200  bg-brand-neutral-3"
                              required
                              placeholder="Enter Email"
                            />
                            {errors.email && touched.email && (
                              <div className="text-brand-warning">{errors.email}</div>
                            )}
                          </div>

                          <div className="flex-1 relative">
                            <label
                              htmlFor="PhoneNumber"
                              className="text-p2 font-medium text-brand-black-200"
                            >
                              {phone_number_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <ReactInputMask
                              mask="(999) 999-9999"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                              placeholder="Enter Phone Number"
                              required
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                              <div className="text-brand-warning">{errors.phoneNumber}</div>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between mt-5">
                          <div className="w-full lg:w-[49%] relative">
                            <label
                              htmlFor="title"
                              className="mb-2 text-p2 font-medium text-brand-black-200"
                            >
                              {title_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3  placeholder:text-brand-black-200  bg-brand-neutral-3"
                              required
                              placeholder="Enter Title"
                            />
                            {errors.title && touched.title && (
                              <div className="text-brand-warning">{errors.title}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-brand-white py-8 sm:px-14 px-7 mb-10">
                        <h1 className="font-bold text-brand-royal-blue text-h4 pb-5">
                          {about_field_title}
                        </h1>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between mb-6">
                          <div className="flex-1 relative">
                            <label
                              htmlFor="schoolName"
                              className="text-p2 font-medium text-brand-black-200"
                            >
                              {school_name_label}
                              <span className="text-brand-warning">*</span>
                            </label>
                            <input
                              type="text"
                              id="schoolName"
                              name="schoolName"
                              value={values.schoolName}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter School Name "
                            />
                            {errors.schoolName && touched.schoolName && (
                              <div className="text-brand-warning">{errors.schoolName}</div>
                            )}
                          </div>
                          <div className="flex-1 relative">
                            <label
                              htmlFor="numberOfStudents"
                              className="text-p2 font-medium text-brand-black-200  "
                            >
                              {number_of_students_label}
                              <span className="text-brand-warning">*</span>
                            </label>

                            <input
                              type="text"
                              id="numberOfStudents"
                              name="numberOfStudents"
                              value={values.numberOfStudents}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter Number of Students"
                            />
                            {errors.numberOfStudents && touched.numberOfStudents && (
                              <div className="text-brand-warning">{errors.numberOfStudents}</div>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between">
                          <div className="w-full lg:w-[49%] relative">
                            <label
                              htmlFor="grades"
                              className="text-p2 font-medium text-brand-black-200"
                            >
                              {grade_label}
                              <span className="text-brand-warning">*</span>
                            </label>

                            <input
                              type="text"
                              id="grades"
                              name="grades"
                              value={values.grades}
                              className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter grades"
                            />
                            {errors.grades && touched.grades && (
                              <div className="text-brand-warning">{errors.grades}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-brand-white py-8 sm:px-14 px-7 ">
                        <h1 className="font-bold text-brand-royal-blue text-h4 pb-5">
                          {booking_field_title}
                        </h1>
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between mb-6 max-w-[878px]">
                          <div className="relative ">
                            <label
                              htmlFor="bookingPrefrences"
                              className="text-p2 font-medium text-brand-black-200 "
                            >
                              {days_of_week_label}
                            </label>
                            <div className="flex gap-4 lg:gap-16 sm:gap-12 mt-4 sm:flex-row flex-col sm:flex-wrap">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
                                (day) => (
                                  <label
                                    key={day}
                                    className="flex items-center gap-3 text-brand-black-200 text-p2"
                                  >
                                    <input
                                      type="checkbox"
                                      name="days"
                                      value={day}
                                      checked={values.days.includes(day)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          // Add the day to the array and initialize the time slot
                                          setFieldValue('days', [...values.days, day]);
                                          setFieldValue('timeSlots', {
                                            ...values.timeSlots,
                                            [day]: 'Morning'
                                          });
                                        } else {
                                          setFieldValue(
                                            'days',
                                            values.days.filter((d) => d !== day)
                                          );
                                          const { [day]: _, ...updatedTimeSlots } =
                                            values.timeSlots;
                                          setFieldValue('timeSlots', updatedTimeSlots);
                                        }
                                      }}
                                      className={clsx(
                                        styles.customCheckbox,
                                        'mr-2 min-h-7 min-w-7'
                                      )}
                                    />
                                    {day}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {values.days.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-10">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                              .filter((day) => values.days.includes(day))
                              .map((day) => (
                                <div key={day} className="mb-4">
                                  <div>
                                    <h2 className="font-bold text-brand-black-200 text-p2">
                                      {day} Time Slot
                                    </h2>
                                    <div className="max-w-[24rem] shadow-[0px_4px_55px_0px_#00000012] flex flex-col mt-2">
                                      <label className="flex items-center">
                                        <Field
                                          type="radio"
                                          name={`timeSlots.${day}`} // Dynamic name based on day
                                          value="Morning"
                                          checked={values.timeSlots[day] === 'Morning'}
                                          onChange={() =>
                                            setFieldValue(`timeSlots.${day}`, 'Morning')
                                          }
                                          className="hidden peer"
                                        />
                                        <div className="peer-checked:bg-brand-neutral-2 hover:bg-brand-neutral-3 text-p2 text-brand-black-200 peer-checked:text-brand-black-200 w-full py-4 px-4 cursor-pointer">
                                          Morning
                                        </div>
                                      </label>
                                      <label className="flex items-center">
                                        <Field
                                          type="radio"
                                          name={`timeSlots.${day}`} // Dynamic name based on day
                                          value="Afternoon"
                                          checked={values.timeSlots[day] === 'Afternoon'}
                                          onChange={() =>
                                            setFieldValue(`timeSlots.${day}`, 'Afternoon')
                                          }
                                          className="hidden peer"
                                        />
                                        <div className="peer-checked:bg-brand-neutral-2 hover:bg-brand-neutral-3 peer-checked:text-brand-black-200 text-p2 text-brand-black-200 w-full py-4 px-3 border-b-2 border-brand-neutral-5 cursor-pointer">
                                          Afternoon
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        <div className="w-full flex flex-col md:flex-row gap-6 justify-between mt-6">
                          <div className="relative flex-1">
                            <label
                              htmlFor="preferredSpeakers"
                              className="text-p2 font-medium text-brand-black-200"
                            >
                              {preferred_speaker_label}
                            </label>
                            <SingleSelect
                              placeholderColor="#232323"
                              className="mt-2 max-w-[28.75rem]  text-p3 bg-brand-neutral-3 font-light h-[3.125rem]"
                              instanceId="preferred-speakers"
                              placeholderFontSize="15px"
                              isSearchable
                              options={speakers.map((team) => ({
                                value: team.title,
                                label: team.title
                              }))}
                              placeholder="Select"
                              onChange={(option) => {
                                setFieldValue('preferredSpeaker', option.value);
                              }}
                              // Preselect the speaker from Formik values
                              value={
                                values.preferredSpeaker
                                  ? {
                                      value: values.preferredSpeaker,
                                      label: values.preferredSpeaker
                                    }
                                  : null
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-10 w-full max-w-[36.75rem] ">
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="bg-brand-green text-brand-white text-p2 font-medium py-4 px-4 rounded-[0.5rem] w-full flex items-center justify-center hover:opacity-90 transition-all duration-300"
                        >
                          Submit
                          <span className="ml-2">
                            <Image
                              src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-2-2.svg"
                              alt="forward-icon"
                              width={8}
                              height={8}
                              className="h-4 w-4"
                            />
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
}

export default ExpressInterestForm;

const Loader = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-brand-blue-sky opacity-50 flex justify-center items-center">
      <Image
        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/New-file2-ezgif.com-crop.gif"
        height={223}
        width={228}
        className="h-[13.938rem] w-[14.25rem]"
      />
    </div>
  );
};
