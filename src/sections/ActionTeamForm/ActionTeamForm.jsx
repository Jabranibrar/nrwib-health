import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import SingleSelect from '@/src/components/SingleSelect';
import axios from 'axios';
import Heading from '@/src/components/Heading';
import CustomLink from '@/src/components/CustomLink';
import { v4 as uuidv4 } from 'uuid';
import NextImage from '@/src/components/NextImage';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const ActionTeamForm = (props) => {
  const formikRef = useRef();
  const {
    heading,
    first_name_label,
    last_name_label,
    email_label,
    title_label,
    image,
    organization_label,
    volunteering_interests_label,
    first_question,
    building_awareness_question,
    healthcare_specialty_label,
    educational_pipeline_question,
    creating_experiences_question,
    challenges_label,
    zip_code_label,
    admin_email,
    thank_you_button_anchor,
    thank_you_button_variant,
    thank_you_message
  } = props;
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBuildingAwareness, setShowBuildingAwareness] = useState(false);
  const [defaultTeam, setDefaultTeam] = useState('');
  const [showEducationPipeline, setShowEducationPipeline] = useState(false);
  const [showCreatingExperiences, setShowCreatingExperiences] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('');

  const button = {
    anchor: thank_you_button_anchor,
    variant: thank_you_button_variant
  };

  const actionTeams = props.departments.filter((attribute) => !attribute?.actionGroups?.hideFromFrontend).map((department) => ({
    value: department.name,
    label: department.name
  }));

  const speciality = Array.from({ length: props.healthcare_speciality_list }).map((_, i) => ({
    value: props[`healthcare_speciality_list_${i}_option`],
    label: props[`healthcare_speciality_list_${i}_option`],
    index: i
  }));

  const interests = Array.from({ length: props.volunteering_interests_list }).map((_, i) => ({
    value: props[`volunteering_interests_list_${i}_options`],
    label: props[`volunteering_interests_list_${i}_options`],
    index: i
  }));

  const challenges = Array.from({ length: props.challenges_list }).map((_, i) => ({
    value: props[`challenges_list_${i}_options`],
    label: props[`challenges_list_${i}_options`],
    index: i
  }));

  const params = useSearchParams();
  const teams = params.get('team'); // Get the team parameter from the URL

  const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    const unitId = 'wpcf7-f7009-o1';
    const uniqueId = uuidv4().slice(0, 4);
    const subject = `Join An Action Team Form Submission #${uniqueId}`;

    let filteredValues = { ...values };

    const updatedValues = {
      ...filteredValues,
      _wpcf7_unit_tag: unitId,
      subject,
      admin_email,
      selectedCondition
    };

    try {
      await axios.post('/api/actionTeam', updatedValues);
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
    if (teams) {
      const teamsIndex = actionTeams.findIndex((actionTeam) => actionTeam.value === teams);
      if (null !== teamsIndex) {
        setDefaultTeam(actionTeams[teamsIndex]);

        if (teams === 'Building Awareness') {
          setShowBuildingAwareness(true);
          setShowEducationPipeline(false);
          setShowCreatingExperiences(false);
          setSelectedCondition(`${building_awareness_question} Yes`);
        } else if (teams === 'Education Pipeline') {
          setShowEducationPipeline(true);
          setShowBuildingAwareness(false);
          setShowCreatingExperiences(false);
          setSelectedCondition(`${educational_pipeline_question} Yes`);
        } else if (teams === 'Creating Experiences') {
          setShowBuildingAwareness(false);
          setShowEducationPipeline(false);
          setShowCreatingExperiences(true);
          setSelectedCondition(`${creating_experiences_question} Yes`);
        }
      }
    }
  }, [teams]);

  return (
    <>
      <section
        className="w-full lg:py-[3.75rem] md:py-10 sm:py-5 md:mb-20 bg-brand-teal relative overflow-hidden"
        data-testid="contact-us-form"
      >
        <div className="lg:py-[2.5rem] md:py-[2.5rem] py-5 md:px-10 px-5 container">
          <Formik
            innerRef={formikRef}
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              zipCode: '',
              title: '',
              organization: '',
              speciality: '',
              interests: '',
              team: '',
              buildingAwareness: 'Yes',
              educationalPipeline: 'Yes',
              creatingExperiences: 'Yes',
              challenges: '',
              selectedCondition: ''
            }}
            validate={(values) => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = 'Required';
              } else if (!values.lastName) {
                errors.lastName = 'Required';
              } else if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
              } else if (!values.zipCode) {
                errors.zipCode = 'Required';
              } else if (!values.organization) {
                errors.organization = 'Required';
              } else if (!values.speciality) {
                errors.speciality = 'Required';
              } else if (!values.challenges) {
                errors.challenges = 'Required';
              } else if (!values.team) {
                errors.team = 'Required';
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
                <div className="lg:w-[80%] py-16 lg:px-10 px-5 bg-white flex justify-center items-center flex-col">
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
                  <div className="lg:w-[85%] lg:mb-8 mb-5 bg-brand-neutral-3 lg:px-[2rem] md:px-10 px-[1.25rem] py-8 ">
                    <Heading className="text-brand-royal-blue font-bold text-h4 mb-8">
                      {heading}
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
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
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
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
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
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
                          required
                          placeholder="Enter Email"
                          value={values.email}
                        />
                      </div>

                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="email"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {title_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
                          required
                          placeholder="Enter Title"
                          value={values.title}
                        />
                      </div>

                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="email"
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {organization_label} <span className="text-brand-warning">*</span>
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
                          required
                          placeholder="Enter Organization"
                          value={values.organization}
                        />
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
                          className="font-light peer w-full h-[3.125rem] py-3 px-4 border border-brand-neutral-5 rounded-md text-p3 placeholder:text-brand-black-200 bg-brand-white"
                          required
                          placeholder="Enter Zip Code"
                          value={values.zipCode}
                        />
                      </div>

                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem]">
                        <label
                          htmlFor="apt"
                          name
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {healthcare_specialty_label} <span className="text-brand-warning">*</span>
                        </label>
                        <SingleSelect
                          instanceId="speciality"
                          isSearchable
                          options={speciality}
                          placeholderColor="#232323"
                          iconColor="#232323"
                          placeholderFontSize="16px"
                          className="w-full text-[16px] !bg-white font-light h-[3.125rem] placeholder:text-p3 placeholder:text-brand-black-200 rounded-lg"
                          placeholder="Select"
                          required
                          value={speciality.find((option) => option.value === values.state)}
                          onChange={(selectedOption) => {
                            handleChange({
                              target: { name: 'speciality', value: selectedOption.label }
                            });
                          }}
                        />
                        {errors.speciality && touched.speciality && (
                          <div className="text-brand-warning">{errors.state}</div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 items-start mb-[-0.125rem] lg:w-full">
                        <label
                          htmlFor="apt"
                          name
                          className="block text-p2 text-brand-black-200 font-medium"
                        >
                          {challenges_label}
                          <span className="text-brand-warning">*</span>
                        </label>
                        <SingleSelect
                          instanceId="challenges"
                          isSearchable
                          options={challenges}
                          placeholderColor="#232323"
                          iconColor="#232323"
                          placeholderFontSize="16px"
                          className="w-full text-[16px] !bg-white font-light h-[3.125rem] placeholder:text-p3 placeholder:text-brand-black-200 rounded-lg"
                          placeholder="Select"
                          required
                          value={challenges.find((option) => option.value === values.state)}
                          onChange={(selectedOption) => {
                            handleChange({
                              target: { name: 'challenges', value: selectedOption.label }
                            });
                          }}
                        />
                        {errors.challenges && touched.challenges && (
                          <div className="text-brand-warning">{errors.challenges}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-start mb-[-0.125rem] mt-5 lg:w-[51%]">
                      <label
                        htmlFor="text"
                        name
                        className="block text-p2 text-brand-black-200 font-medium"
                      >
                        {first_question} <span className="text-brand-warning">*</span>
                      </label>
                      <SingleSelect
                        instanceId="team"
                        isSearchable
                        options={actionTeams}
                        placeholderColor="#232323"
                        iconColor="#232323"
                        placeholderFontSize="16px"
                        className="w-full text-[16px] !bg-white font-light h-[3.125rem] placeholder:text-p3 placeholder:text-brand-black-200 rounded-lg"
                        placeholder="Select"
                        required
                        value={defaultTeam}
                        onChange={(selectedOption) => {
                          handleChange({
                            target: { name: 'team', value: selectedOption.label }
                          });
                          setDefaultTeam(selectedOption)
                          if (selectedOption.label === 'Building Awareness') {
                            setShowBuildingAwareness(true);
                            setShowEducationPipeline(false);
                            setShowCreatingExperiences(false);
                            setSelectedCondition(`${building_awareness_question} Yes`);
                          } else if (selectedOption.label === 'Education Pipeline') {
                            setShowEducationPipeline(true);
                            setShowBuildingAwareness(false);
                            setShowCreatingExperiences(false);
                            setSelectedCondition(`${educational_pipeline_question} Yes`);
                          } else if (selectedOption.label === 'Creating Experiences') {
                            setShowBuildingAwareness(false);
                            setShowEducationPipeline(false);
                            setShowCreatingExperiences(true);
                            setSelectedCondition(`${creating_experiences_question} Yes`);
                          } else {
                            setShowBuildingAwareness(false);
                            setShowBuildingAwareness(false);
                            setShowCreatingExperiences(false);
                            setSelectedCondition('');
                          }
                        }}
                      />
                      {errors.team && touched.team && (
                        <div className="text-brand-warning">{errors.team}</div>
                      )}
                    </div>
                    {showBuildingAwareness && (
                      <div className="my-8 border-t border-b border-t-brand-green border-b-brand-green py-4">
                        <label
                          htmlFor="text"
                          name
                          className="block text-p2 text-brand-black-200 font-normal "
                        >
                          {building_awareness_question}
                        </label>
                        <div className="flex flex-col gap-4 my-2">
                          <label>
                            <input
                              type="radio"
                              name="buildingAwareness"
                              className="mr-2"
                              value="yes"
                              checked={values.buildingAwareness === 'Yes'}
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${building_awareness_question} Yes`)
                                );
                              }}
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="buildingAwareness"
                              className="mr-2"
                              value="no"
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${building_awareness_question} No`)
                                );
                              }}
                            />
                            No
                          </label>
                        </div>
                      </div>
                    )}
                    {showEducationPipeline && (
                      <div className="my-8 border-t border-b border-t-brand-green border-b-brand-green py-4">
                        <label
                          htmlFor="text"
                          name
                          className="block text-p2 text-brand-black-200 font-normal "
                        >
                          {educational_pipeline_question}
                        </label>
                        <div className="flex flex-col gap-4 my-2">
                          <label>
                            <input
                              type="radio"
                              name="educationalPipeline"
                              className="mr-2"
                              value="yes"
                              checked={values.educationalPipeline === 'Yes'}
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${educational_pipeline_question} Yes`)
                                );
                              }}
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="educationalPipeline"
                              className="mr-2"
                              value="no"
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${educational_pipeline_question} No`)
                                );
                              }}
                            />
                            No
                          </label>
                        </div>
                      </div>
                    )}
                    {showCreatingExperiences && (
                      <div className="my-8 border-t border-b border-t-brand-green border-b-brand-green py-4">
                        <label
                          htmlFor="text"
                          name
                          className="block text-p2 text-brand-black-200 font-normal "
                        >
                          {creating_experiences_question}
                        </label>
                        <div className="flex flex-col gap-4 my-2">
                          <label>
                            <input
                              type="radio"
                              name="creatingExperiences"
                              className="mr-2"
                              value="yes"
                              checked={values.creatingExperiences === 'Yes'}
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${educational_pipeline_question} Yes`)
                                );
                              }}
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="creatingExperiences"
                              className="mr-2"
                              value="no"
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  setSelectedCondition(`${educational_pipeline_question} No`)
                                );
                              }}
                            />
                            No
                          </label>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="flex flex-col items-start gap-10">
                    <button
                      className="sm:w-1/2  w-full p-4 rounded-[0.5rem] bg-brand-blue text-p2 font-medium text-brand-white inline-flex gap-[0.625rem] justify-center items-center text-center"
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
          <div className="lg:w-[20%] absolute right-0 top-0 bottom-0 lg:block hidden">
            <NextImage {...image} otherClasses="w-full h-[unset] object-cover object-" />
          </div>
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
};

export default ActionTeamForm;

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
