import React, { useEffect, useRef, useState } from 'react';
import styles from './FeedBackSurvey.module.scss';
import Heading from '@/src/components/Heading';
import { Formik } from 'formik';
import SingleSelect from '@/src/components/SingleSelect';
import clsx from 'clsx';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function FeedbackSurvey(props) {
  const {
    gender_label,
    age_label,
    email_address_label,
    ethnicity_label,
    first_question,
    fourth_question,
    second_question,
    third_question,
    admin_email,
    thank_you_button_anchor,
    thank_you_button_variant,
    thank_you_message,
    heading
  } = props;
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const mainContainerRef = useRef();
  const emailRef = useRef();
  const raffleEntryEmailRef = useRef();

  const button = {
    anchor: thank_you_button_anchor,
    variant: thank_you_button_variant
  };

  const ethnicityOptions = Array.from({ length: props.ethnicity_options }).map((_, i) => ({
    value: props[`ethnicity_options_${i}_options`],
    label: props[`ethnicity_options_${i}_options`]
  }));

  const genderOptions = Array.from({ length: props.gender_options }).map((_, i) => ({
    value: props[`gender_options_${i}_options`],
    label: props[`gender_options_${i}_options`]
  }));

  const scrollToField = (ref) => {
    if (ref && ref?.current) {
      requestAnimationFrame(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          ref.current.focus();
        }, 300);
      });
    }
  };

  useEffect(() => {
    if (formStatus === 'success' && mainContainerRef?.current) {
      mainContainerRef.current.scrollIntoView();
    }
  }, [formStatus]);

  const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    const unitId = 'wpcf7-f5666-o1';
    const first = `${first_question} ${values.siteHelpful ? 'Yes' : 'No'}`;
    const second = `${second_question} ${values.utilizeSite ? 'Yes' : 'No'}`;
    const third = `${third_question} ${values.raffleEntry ? 'Yes' : 'No'}`;
    const forth = `${fourth_question} ${values.emailList ? 'Yes' : 'No'}`;

    const uniqueId = uuidv4().slice(0, 4);

    const subject = `Feedback Survey Form Submission #${uniqueId}`;
    const updatedValues = {
      ...values,
      _wpcf7_unit_tag: unitId,
      subject,
      admin_email,
      first,
      second,
      third,
      forth
    };

    try {
      const response = await axios.post('/api/feedbackSurveyForm', updatedValues);
      setFormStatus('success');
      resetForm();
    } catch (error) {
      setFormStatus('error');
    } finally {
      setSubmitting(false);
      setLoading(false);
      scrollUp();
    }
  };

  return (
    <>
      <section
        data-testid="feedback-survey"
        className={`py-16 ${styles.mainContainer}`}
        ref={mainContainerRef}
      >
        <div className="max-w-screen-xl lg:px-10 px-5 mx-auto">
          {formStatus !== 'success' && (
            <div className="py-6 px-4 bg-brand-teal">
              <Heading otherClasses="text-white text-h2 md:text-h1 font-semibold font-manrope text-center">
                {heading}
              </Heading>
            </div>
          )}

          <Formik
            initialValues={{
              gender: '',
              ethnicity: '',
              age: '',
              emailAddress: '',
              raffleEntryEmailAddress: '',
              siteHelpful: true,
              utilizeSite: true,
              raffleEntry: true,
              emailList: true,
              selectedConditions: ''
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validate={(values) => {
              const errors = {};
              if (!values.emailAddress) {
                errors.emailAddress = 'Required';
                scrollToField(emailRef);
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.emailAddress)) {
                errors.emailAddress = 'Invalid email address';
                scrollToField(emailRef);
              } else if (
                values.raffleEntryEmailAddress &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.raffleEntryEmailAddress)
              ) {
                errors.raffleEntryEmailAddress = 'Invalid email address';
                scrollToField(raffleEntryEmailRef);
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
              handleSubmit,
              isSubmitting,
              setFieldValue
            }) =>
              formStatus === 'success' ? (
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
                <form
                  onSubmit={handleSubmit}
                  className="px-5 lg:px-[11.5rem] py-12 bg-white flex flex-col gap-8"
                >
                  <div className="flex gap-2 flex-col">
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold">
                      {gender_label}
                    </Heading>
                    <SingleSelect
                      name="gender"
                      className="w-full font-normal mt-2 placeholder:text-brand-black-200 text-p3"
                      isSearchable
                      placeholderColor="#232323"
                      iconColor="#232323"
                      placeholderFontSize="15px"
                      placeholder="Select Gender"
                      required
                      options={genderOptions}
                      value={genderOptions.find((option) => option.value === values.gender)}
                      onChange={(option) => setFieldValue('gender', option.value)}
                    />
                  </div>

                  <div className="flex gap-2 flex-col">
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold">
                      {ethnicity_label}
                    </Heading>
                    <SingleSelect
                      className="w-full font-normal mt-2 placeholder:text-brand-black-200 text-p3"
                      isSearchable
                      name="ethnicity"
                      placeholderColor="#232323"
                      iconColor="#232323"
                      placeholderFontSize="15px"
                      placeholder="Select Ethnicity"
                      required
                      options={ethnicityOptions}
                      value={ethnicityOptions.find((option) => option.value === values.ethnicity)}
                      onChange={(option) => setFieldValue('ethnicity', option.value)}
                    />
                  </div>

                  <div className="w-full flex flex-col gap-2 justify-between">
                    <label htmlFor="age" className="text-brand-darker text-p2 font-semibold">
                      {age_label}
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200"
                      placeholder="Enter Age"
                      value={values.age}
                      required
                    />
                  </div>

                  <div className="w-full flex flex-col gap-2 justify-between">
                    <label
                      htmlFor="emailAddress"
                      className="text-brand-darker text-p2 font-semibold"
                    >
                      {email_address_label}
                    </label>
                    <input
                      type="text"
                      id="emailAddress"
                      name="emailAddress"
                      ref={emailRef}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="font-light mt-2 peer w-full h-[3.125rem] focus:outline-none disabled:border-none py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200"
                      placeholder="Enter Email Address"
                      value={values.emailAddress}
                      required
                    />
                  </div>

                  {/* First Question - Site Helpful */}
                  <div>
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold mb-2">
                      {first_question}
                    </Heading>

                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                        <input
                          type="radio"
                          className="hidden peer"
                          checked={values.siteHelpful}
                          onChange={() => setFieldValue('siteHelpful', true)} />
                        <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                        <span class="text-p4 font-normal text-brand-dark-grey">Yes</span>
                    </label>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={!values.siteHelpful}
                        onChange={() => setFieldValue('siteHelpful', false)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">No</span>
                    </label>
                  </div>

                  <div>
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold mb-2">
                      {second_question}
                    </Heading>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={values.utilizeSite}
                        onChange={() => setFieldValue('utilizeSite', true)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">Yes</span>
                    </label>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={!values.utilizeSite}
                        onChange={() => setFieldValue('utilizeSite', false)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">No</span>
                    </label>
                  </div>

                  <div>
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold mb-[0.938rem]">
                      {third_question}
                    </Heading>

                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={values.raffleEntry}
                        onChange={() => setFieldValue('raffleEntry', true)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">Yes</span>
                    </label>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={!values.raffleEntry}
                        onChange={() => setFieldValue('raffleEntry', false)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">No</span>
                    </label>
                  </div>

                  <div>
                    <Heading otherClasses="text-brand-darker text-p2 font-semibold mb-2">
                      {fourth_question}
                    </Heading>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={values.emailList}
                        onChange={() => setFieldValue('emailList', true)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">Yes</span>
                    </label>
                    <label className="flex items-center gap-x-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        className="hidden peer"
                        checked={!values.emailList}
                        onChange={() => setFieldValue('emailList', false)} />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></span>
                      <span className="text-p4 font-normal text-brand-dark-grey">No</span>
                    </label>
                  </div>

                  <div className="mt-12 mx-auto flex flex-col justify-center items-center gap-3">
                    <button
                      className="p-4 bg-brand-green hover:opacity-80 rounded-lg w-[17.688rem] flex justify-center items-center gap-[0.625rem"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="text-white text-lg leading-[100%] font-medium">Submit</span>
                      <Image
                        height={16}
                        width={16}
                        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-2-2.svg"
                        alt="arrow"
                        className="h-4 w-4"
                      />
                    </button>
                    <Link
                      href="/"
                      className="text-brand-dark-grey text-base leading-7 font-semibold underline underline-offset-2"
                    >
                      No, thanks
                    </Link>
                  </div>
                </form>
              )
            }
          </Formik>
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
}

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
