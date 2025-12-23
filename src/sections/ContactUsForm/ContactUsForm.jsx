import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import styles from './ContactUsForm.module.scss';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import SingleSelect from '@/src/components/SingleSelect';
import clsx from 'clsx';
import axios from 'axios';
import Heading from '@/src/components/Heading';
import CustomLink from '@/src/components/CustomLink';
import countryList from 'country-list-js';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

const usStates = countryList.findByIso2('US').provinces.map((province) => ({
  value: province.short,
  label: province.name
}));

const ContactUsForm = (props) => {
  const router = useRouter();
  const formikRef = useRef();
  const { role: urlRole, otherReason: urlOtherReason } = router.query;
  const {
    reason_of_inquiry_label,
    contact_information_label,
    first_name_label,
    last_name_label,
    email_label,
    street_address_label,
    zip_code_label,
    appartment_label,
    city_label,
    state_label,
    how_can_we_help_label,
    message_label,
    thank_you_button_anchor,
    thank_you_button_variant,
    thank_you_message
  } = props;
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);
  const [showRoleOtherField, setShowRoleOtherField] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState('');
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [showActionTeamSelect, setShowActionTeamSelect] = useState(false);

  const actionTeams = props.departments;

  const button = {
    anchor: thank_you_button_anchor,
    variant: thank_you_button_variant
  };

  const searchParams = useSearchParams();
  const reasons = searchParams.get('reason');

  useEffect(() => {
    if (reasons) {
      let found = false;
      const trimmedReasons = reasons.trim(); // Trim whitespace
      Array.from({ length: props.reason_of_inquiry }).map((_, roleIndex) => {
        if (found) return;
        const options = props[`reason_of_inquiry_${roleIndex}_options`];
        Array(options)
          .fill(null)
          ?.map((_, reasonIndex) => {
            if (found) return;
            const reasonOfInquiry = props[`reason_of_inquiry_${roleIndex}_options_${reasonIndex}_option`].trim(); // Trim options
            const role = {
              value: props[`reason_of_inquiry_${roleIndex}_role`],
              label: props[`reason_of_inquiry_${roleIndex}_role`],
              index: roleIndex
            };
            if (trimmedReasons === reasonOfInquiry) {
              handleRoleChange(role, formikRef.current.setFieldValue, trimmedReasons);
              found = true;
            }
          });
      });
    }
  }, [reasons]);

  const roles = Array.from({ length: props.reason_of_inquiry }).map((_, i) => ({
    value: props[`reason_of_inquiry_${i}_role`],
    label: props[`reason_of_inquiry_${i}_role`],
    index: i
  }));
  const handleRoleChange = (selectedRole, setFieldValue, reasonOfInquiry = false) => {
    setSelectedRoleIndex(selectedRole.index);
    setHasSelectedRole(true);

    // Reset both the role and the inquiryReason
    setFieldValue('role', selectedRole.value);
    setFieldValue(
      'inquiryReason',
      reasonOfInquiry ? (selectedRole.value === 'Other' && reasonOfInquiry !== 'Membership Inquiry' && reasonOfInquiry !== 'Join an action team' ? 'Other' : reasonOfInquiry) : ''
    );

    // Ensure the inquiryReason select dropdown is reset
    if (selectedRole.value === 'Other') {
      setShowRoleOtherField(true);
      setShowOtherField(reasonOfInquiry && reasonOfInquiry !== 'Membership Inquiry' && reasonOfInquiry !== 'Join an action team' ? true : false);
      setShowActionTeamSelect(false);
    } else {
      setShowRoleOtherField(false);
      setShowOtherField(reasonOfInquiry === 'Other' ? true : false);
      setShowActionTeamSelect(reasonOfInquiry === 'Join an action team' ? true : false);
    }
  };

  const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    const unitId = 'wpcf7-f1181-o1';

    const uniqueId = uuidv4().slice(0, 4);

    const subject = `${values.role}: Contact Form Submission #${uniqueId}`;
    // Add unitId to the values object directly
    const updatedValues = {
      ...values,
      _wpcf7_unit_tag: unitId,
      subject,
      checkbox: values.days === 'Yes' ? 'Yes' : 'No'
    };

    try {
      const response = await axios.post('/api/contactUsForm', updatedValues);
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

  const scrollUp = () => {
    window.scrollBy({
      top: -500,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (urlRole) {
      const roleOption = roles.find((role) => role.value === urlRole);
      if (roleOption) {
        setSelectedRoleIndex(roleOption.index);
        if (formikRef.current) {
          formikRef.current.setFieldValue('role', roleOption.value);
        }
        setHasSelectedRole(true);
        setShowRoleOtherField(urlRole === 'Other');
      } else {
        if (formikRef.current) {
          formikRef.current.setFieldValue('role', 'Other');
          setHasSelectedRole(true);
          setShowRoleOtherField(true);
        }
      }
    }
  }, [urlRole]);

  const renderRoleOptions = (errors, values, setFieldValue, handleChange, handleBlur) => {
    if (selectedRoleIndex === null) return null;
    const options = props[`reason_of_inquiry_${selectedRoleIndex}_options`];
    const roleOptions = Array(options)
      .fill(null)
      ?.map((_, i) => ({
        value: props[`reason_of_inquiry_${selectedRoleIndex}_options_${i}_option`],
        label: props[`reason_of_inquiry_${selectedRoleIndex}_options_${i}_option`],
        email: props[`reason_of_inquiry_${selectedRoleIndex}_options_${i}_admin_email`]
      }));
    return (
      <>
        <SingleSelect
          isSearchable
          name="inquiryReason"
          placeholderColor="#232323"
          iconColor="#232323"
          className="w-full mt-2 placeholder:text-brand-black-200 text-p3 bg-brand-neutral-3 font-light h-[3.125rem] "
          placeholder="Reason of Inquiry"
          placeholderFontSize="15px"
          options={roleOptions}
          isDisabled={!hasSelectedRole}
          value={roleOptions.find((option) => option.value === values.inquiryReason) || null}
          onChange={(selectedOption) => {
            setFieldValue('inquiryReason', selectedOption.value);
            setFieldValue('adminEmail', selectedOption.email);

            if (selectedOption.value === 'Other') {
              setShowOtherField(true);
              setShowActionTeamSelect(false);
            } else if (selectedOption.value === 'Join an action team') {
              setShowActionTeamSelect(true);
              setShowOtherField(false);
            } else {
              setShowOtherField(false);
              setShowActionTeamSelect(false);
              setFieldValue('otherReason', '');
            }
          }}
        />
        {errors.inquiryReson && touched.inquiryReson && (
          <div className="text-brand-warning">{errors.inquiryReson}</div>
        )}

        {showOtherField && (
          <div className="my-4">
            <label
              htmlFor="otherReason"
              className="block text-p2 text-brand-black-200 font-semibold"
            >
              Please share the subject of your inquiry
            </label>

            <textarea
              id="otherReason"
              name="otherReason"
              className="w-full min-h-[8rem] py-3 px-4 border border-brand-neutral-5 focus:border-brand-neutral-5 bg-brand-neutral-3 rounded-md font-light placeholder:text-[#333333] text-[#333333] text-base mt-3"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your Reason"
              value={values.otherReason || urlOtherReason || reasons || ''}
            />
            {errors.otherReason && touched.otherReason && (
              <div className="text-brand-warning">{errors.otherReason}</div>
            )}
          </div>
        )}

        {showActionTeamSelect && (
          <div className="my-4">
            <label htmlFor="actionTeam" className="block text-p2 text-brand-black-3 font-medium">
              Select an Action Team
            </label>
            <SingleSelect
              name="actionTeam"
              placeholderColor="#4E4D4D"
              iconColor="#4E4D4D"
              placeholderFontSize="15px"
              className="w-full mt-2 placeholder:text-brand-grayish text-p3 bg-brand-neutral border-brand-neutral-6 font-light h-[3.125rem] rounded-lg"
              options={actionTeams.map((team) => ({
                value: team.name,
                label: team.name
              }))}
              placeholder="Select Action Team"
              onChange={(selectedOption) => {
                setFieldValue('actionTeam', selectedOption.value);
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <section
        className="max-w-screen-xl w-full mx-auto lg:px-10 sm:px-5 lg:py-[3.75rem] md:py-10 sm:py-5 md:mb-20"
        data-testid="contact-us-form"
      >
        <div className="bg-brand-teal lg:py-[3.5rem] md:py-[2.5rem] py-5 md:px-10 px-5">
          <Formik
            innerRef={formikRef}
            initialValues={{
              role: urlRole ? urlRole : '',
              inquiryReason: '',
              firstName: '',
              lastName: '',
              email: '',
              streetAddress: '',
              suite: '',
              city: '',
              state: '',
              zipCode: '',
              message: '',
              days: 'Yes'
            }}
            validate={(values) => {
              const errors = {};
              if (!values.role) {
                errors.role = 'Required';
              } else if (!values.inquiryReason) {
                errors.inquiryReason = 'Required';
              } else if (!values.firstName) {
                errors.firstName = 'Required';
              } else if (!values.lastName) {
                errors.lastName = 'Required';
              } else if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
              } else if (!values.streetAddress) {
                errors.streetAddress = 'Required';
              } else if (!values.city) {
                errors.city = 'Required';
              } else if (!values.state) {
                errors.state = 'Required';
              } else if (!values.zipCode) {
                errors.zipCode = 'Required';
              } else if (!values.message) {
                errors.message = 'Required';
              }
              return errors;
            }}
            onSubmit={handleSubmitForm}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
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
                <form onSubmit={handleSubmit}>
                  <div className="w-full">
                    <div className="lg:mb-8 mb-5 bg-brand-white lg:px-[3.5rem] md:px-10 px-[1.25rem] py-8 ">
                      <Heading className="text-brand-royal-blue font-bold text-h4 mb-8">
                        {reason_of_inquiry_label}
                      </Heading>
                      <div className="w-full gap-6 grid sm:grid-cols-2 grid-cols-1">
                        <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                          <SingleSelect
                            isSearchable
                            placeholderFontSize="15px"
                            name="role"
                            className="w-full mt-2 placeholder:text-brand-black-200 text-p3 bg-brand-neutral-3 font-light h-[3.125rem]"
                            options={roles}
                            required
                            placeholderColor="#232323"
                            iconColor="#232323"
                            placeholder="Select Role"
                            value={roles.find((option) => option.value === values.role)}
                            onChange={(selectedRole) => {
                              handleRoleChange(selectedRole, setFieldValue);
                            }}
                          />
                          {showRoleOtherField && (
                            <div className="my-4 w-full">
                              <label
                                htmlFor="otherRole"
                                className="block text-p2 text-brand-black-200 font-semibold"
                              >
                                Please share your role
                              </label>

                              <textarea
                                id="otherRole"
                                name="otherRole"
                                className="w-full min-h-[8rem] py-3 px-4 border border-brand-neutral-5 focus:border-brand-neutral-5 bg-brand-neutral-3 rounded-md font-light placeholder:text-[#333333] text-[#333333] text-base mt-3"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter Your Role"
                                value={values.otherRole || ''}
                              />
                              {errors.otherRole && touched.otherRole && (
                                <div className="text-brand-warning">{errors.otherRole}</div>
                              )}
                            </div>
                          )}
                          {errors.role && touched.role && (
                            <div className="text-brand-warning">{errors.role}</div>
                          )}
                        </div>
                        {renderRoleOptions(errors, values, setFieldValue, handleBlur, handleChange)}
                      </div>
                    </div>
                  </div>
                  <div className="lg:mb-8 mb-5 bg-brand-white lg:px-[3.5rem] md:px-10 px-[1.25rem] py-8 ">
                    <Heading className="text-brand-royal-blue font-bold text-h4 mb-8">
                      {contact_information_label}
                    </Heading>
                    <div className="w-full gap-6 grid sm:grid-cols-2 grid-cols-1">
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="firstName"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {first_name_label} <span className="text-brand-warning">*</span>
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
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label htmlFor="lastName" className="text-p2 font-semibold brand-black-200">
                          {last_name_label} <span className="text-brand-warning">*</span>
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
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="email"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {email_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="email"
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
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="streetAddress"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {street_address_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="text"
                          id="streetAddress"
                          name="streetAddress"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                          required
                          placeholder="Enter address"
                          value={values.streetAddress}
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="apt"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {appartment_label}
                        </label>
                        <input
                          type="text"
                          id="suite"
                          name="suite"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                          placeholder="Enter Suite"
                          value={values.suite}
                        />
                        {errors.suite && touched.suite && (
                          <div className="text-brand-warning">{errors.suite}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="city"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {city_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                          required
                          placeholder="Enter City"
                          value={values.city}
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="apt"
                          name
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {state_label} <span className="text-brand-warning">*</span>
                        </label>
                        <SingleSelect
                          instanceId="state"
                          isSearchable
                          options={usStates}
                          placeholderColor="#232323"
                          iconColor="#232323"
                          placeholderFontSize="15px"
                          className="w-full text-p3 bg-brand-neutral-3 font-light h-[3.125rem] placeholder:text-p3 placeholder:text-brand-black-200"
                          placeholder="Enter State"
                          required
                          value={usStates.find((option) => option.value === values.state)}
                          onChange={(selectedOption) => {
                            handleChange({
                              target: { name: 'state', value: selectedOption.label }
                            });
                          }}
                        />
                        {errors.state && touched.state && (
                          <div className="text-brand-warning">{errors.state}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="zipCode"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {zip_code_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                          required
                          placeholder="Enter Zip Code"
                          value={values.zipCode}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="lg:mb-8 mb-5 bg-brand-white lg:px-[3.5rem] md:px-10 px-[1.25rem] py-8 ">
                    <Heading className="text-brand-royal-blue font-bold text-h4 mb-8">
                      {how_can_we_help_label}
                    </Heading>
                    <div className="w-full gap-6 grid gird-cols-1">
                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="message"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {message_label} <span className="text-brand-warning">*</span>
                        </label>
                        <textarea
                          type="text"
                          id="message"
                          name="message"
                          className="font-light peer w-full min-h-[8rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-neutral-3"
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Message"
                          value={values.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-10">
                    <label
                      className={`flex items-start gap-3 text-brand-white text-p2 sm:w-1/2 w-full cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        name="days"
                        value={values.days === 'Yes' ? 'Yes' : 'No'}
                        checked={values.days === 'Yes'} // Bind the checked state
                        onChange={(e) => setFieldValue('days', e.target.checked ? 'Yes' : 'No')} // Update Formik state
                        className={clsx(styles.customCheckbox, 'min-h-7 min-w-7')}
                      />
                      Yes, I would like to receive news and updates
                    </label>

                    <button
                      className="sm:w-1/2  w-full p-4 rounded-[0.5rem] bg-brand-green text-p2 font-medium text-brand-white inline-flex gap-[0.625rem] justify-center items-center text-center"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span>{loading ? 'Loading...' : 'Submit'}</span>
                      {!loading && (
                        <div className="relative w-4 h-4">
                          <Image
                            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-2-2.svg"
                            alt="next-icon"
                            fill
                            className="absolute top-0 left-0"
                          />
                        </div>
                      )}
                    </button>
                  </div>
                  {formStatus === 'error' && (
                    <div className="mt-4 text-brand-red text-h1 font-bold text-center">
                      There was an error submitting the form.
                    </div>
                  )}
                </form>
              )
            }
          </Formik>
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
};

export default ContactUsForm;

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
