import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import Heading from '@/src/components/Heading';
import CustomLink from '@/src/components/CustomLink';
import { useSearchParams } from 'next/navigation';
import HtmlBlock from '@/src/components/HtmlBlock';
import { v4 as uuidv4 } from 'uuid';

const SubscribeForm = (props) => {
  const { title, description, admin_email } = props;
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const serachParams = useSearchParams();
  const emailParams = serachParams.get('email');

  useEffect(() => {
    if (formStatus) {
      const timer = setTimeout(() => {
        //setFormStatus('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  return (
    <>
      <section className="w-full bg-brand-neutral-2" data-testid="contact-us-form">
        <div className="max-w-screen-xl w-full mx-auto lg:px-10 px-5 lg:py-[3.75rem] md:py-10 py-5">
          <div className="lg:pr-[3.5rem] md:pr-[2.5rem]">
            <h1 className="text-brand-royal-blue text-h2 mb-4 text-start font-semibold">{title}</h1>
            <HtmlBlock
              content={description}
              className="text-brand-darker text-p2 mb-10 text-start font-normal max-w-[62.375rem] w-full"
            />
            <div className="w-full bg-brand-teal h-[0.063rem] mb-10" />
          </div>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              organization: ''
            }}
            validate={(values) => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = 'Required';
              }
              if (!values.lastName) {
                errors.lastName = 'Required';
              }
              if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
              }
              if (!values.organization) {
                errors.organization = 'Required';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setLoading(true);
              const uniqueId = uuidv4().slice(0, 4);
              const subject = `Subscribe Form Submission #${uniqueId}`;
              const updatedValues = {
                ...values,
                subject,
                admin_email
              };
              try {
                const response = await fetch('/api/subscribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(updatedValues)
                });

                const result = await response.json();

                if (response.ok) {
                  setFormStatus('success');
                  resetForm();
                } else {
                  setFormStatus('error');
                  console.error(result.error);
                }
              } catch (error) {
                console.error('Error subscribing:', error);
                setFormStatus('error');
              }
              setLoading(false);
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => {
              useEffect(() => {
                if (emailParams) {
                  setFieldValue('email', emailParams);
                }
              }, [emailParams]);

              return formStatus === 'success' ? (
                <div className="py-16 lg:px-10 px-5 bg-white flex justify-center items-center flex-col">
                  <Image
                    src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Secondary_Stacked_FullColor-1.svg"
                    alt="logo image"
                    height={121}
                    width={309}
                    className="h-[7.563rem] w-[19.313rem]"
                  />
                  <Heading otherClasses="text-brand-royal-blue text-h3 font-semibold mt-8 text-center">
                    You are successfully subscribed to our newsletter!
                  </Heading>
                  <CustomLink
                    variant="green-right-arrow"
                    anchor={{ title: 'Return To Homepage', anchor: '/' }}
                    otherClasses="mt-[4rem]"
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="w-full gap-6 grid sm:grid-cols-2 grid-cols-1 mb-12">
                    <div className="flex flex-col gap-2 items-start mb-[-0.125rem] lg:pr-[3.5rem] md:pr-[2.5rem]">
                      <label
                        htmlFor="firstName"
                        className="block text-p2 text-brand-black-200 font-semibold"
                      >
                        First Name <span className="text-brand-warning">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                        required
                        placeholder="Enter First Name"
                        value={values.firstName}
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-start mb-[-0.125rem] lg:pr-[3.5rem] md:pr-[2.5rem]">
                      <label
                        htmlFor="lastName"
                        className="block text-p2 text-brand-black-200 font-semibold"
                      >
                        Last Name <span className="text-brand-warning">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                        required
                        placeholder="Enter Last Name"
                        value={values.lastName}
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-start mb-[-0.125rem] lg:pr-[3.5rem] md:pr-[2.5rem]">
                      <label
                        htmlFor="email"
                        className="block text-p2 text-brand-black-200 font-semibold"
                      >
                        Email <span className="text-brand-warning">*</span>
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                        required
                        placeholder="Enter Email"
                        value={values.email}
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-start mb-[-0.125rem] lg:pr-[3.5rem] md:pr-[2.5rem]">
                      <label
                        htmlFor="organization"
                        className="block text-p2 text-brand-black-200 font-semibold"
                      >
                        Organization <span className="text-brand-warning">*</span>
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                        required
                        placeholder="Enter Organization"
                        value={values.organization}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-10">
                    <button
                      className="max-w-[24rem] w-full bg-brand-teal p-4 rounded-[0.5rem] text-p2 font-medium text-brand-white inline-flex justify-center items-center text-center gap-2"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span>Submit</span>
                      <div className="relative w-4 h-4">
                        <Image
                          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-2-2.svg"
                          alt="next-icon"
                          fill
                          className="absolute top-0 left-0"
                        />
                      </div>
                    </button>
                  </div>
                  {formStatus === 'error' && (
                    <div className="mt-4 text-red text-p3 font-medium text-left">
                      There was an error submitting the form.
                    </div>
                  )}
                </form>
              );
            }}
          </Formik>
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
};

export default SubscribeForm;

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
