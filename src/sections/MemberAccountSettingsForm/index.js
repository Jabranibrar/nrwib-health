import { useState, useRef, useEffect } from "react";
import { useUpdateUserMutation } from "@/src/hooks/useUpdateUserMutation";
import { sanitize, formatPhoneNumber } from "@/src/utils/miscellaneous";
import { isPhoneNumber } from "@/src/utils/validator/phone";
import Loading from "@/src/components/Loading";
import useAuth from '@/src/hooks/useAuth';
import AuthContent from '@/src/components/AuthContent';
import Heading from '@/src/components/Heading';
import Icon from '@/src/components/Icon';
import styles from './MemberAccountSettingsForm.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';

const emailFrequencyValues = ['Daily', 'Weekly'];

export default function MemberAccountSettingsForm() {
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState({});

  useEffect(() => {
    if (user) {
      setAccountInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user?.email,
        organization: user?.profileField?.organization,
        title: user?.profileField?.title,
        phoneNumber: user?.profileField?.phoneNumber,
        emailFrequency: user?.profileField?.emailFrequency,
      });
    }
  }, [user]);

  const formRef = useRef(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checkedEFState, setCheckedEFState] = useState(() => emailFrequencyValues.map((value) => accountInfo?.emailFrequency?.includes(value)));
  const [isLoading, setIsLoading] = useState(false);
  const [updateUser, { loading }] = useUpdateUserMutation();

  function handleEFCheckboxChange(position) {
    const updatedCheckedEFState = checkedEFState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedEFState(updatedCheckedEFState);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    formRef.current?.reportValidity();
    if (accountInfo?.phoneNumber && !isPhoneNumber(accountInfo?.phoneNumber)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      const emailFrequency = emailFrequencyValues.filter((item, index) => checkedEFState[index]);
      await updateUser({
        id: user?.id,
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        organization: accountInfo.organization,
        title: accountInfo.title,
        phoneNumber: accountInfo.phoneNumber,
        emailFrequency,
      });

      setIsLoading(false);

      setError("");
      setMessage(
        "Thank you, your account information was updated successfully."
      );
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  }

  const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
      (key >= 48 && key <= 57) || // Allow number line
      (key >= 96 && key <= 105) // Allow number pad
    );
  };

  const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
      event.shiftKey === true ||
      key === 35 ||
      key === 36 || // Allow Shift, Home, End
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 46 || // Allow Backspace, Tab, Enter, Delete
      (key > 36 && key < 41) || // Allow left, up, right, down
      // Allow Ctrl/Command + A,C,V,X,Z
      ((event.ctrlKey === true || event.metaKey === true) &&
        (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
  };

  const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
      event.preventDefault();
    }
  };

  const formatToPhone = (event) => {
    if (event.type == "keyup" && isModifierKey(event)) {
      return;
    }

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = event.target.value.replace(/\D/g, "").substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
      target.value = `(${zip}) ${middle}-${last}`;
    } else if (input.length > 3) {
      target.value = `(${zip}) ${middle}`;
    } else if (input.length > 0) {
      target.value = `(${zip}`;
    }
  };

  useEffect(() => {
    const inputElement = document.getElementById("phone-number");
    inputElement?.addEventListener("keydown", enforceFormat);
    inputElement?.addEventListener("keyup", formatToPhone);
  }, []);

  useEffect(() => {
    if (Array.isArray(accountInfo?.emailFrequency)) {
      setCheckedEFState(emailFrequencyValues.map((value) => accountInfo.emailFrequency.includes(value)));
    }
  }, [accountInfo?.emailFrequency]);

  return (
    <>
      <>
        <div className="w-full px-12 py-16 bg-brand-teal">
          <AuthContent>
            <div className={"relative max-w-5xl mx-auto"}>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
              >
                <div className={"bg-brand-neutral-3 p-12"}>
                  {
                    message ?
                      <div className="py-16 lg:px-10 px-5 bg-white flex justify-center items-center flex-col">
                        <Image
                          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Secondary_Stacked_FullColor-1.svg"
                          alt="logo image"
                          height={121}
                          width={309}
                          className="h-[7.563rem] w-[19.313rem]"
                        />
                        <Heading otherClasses="text-brand-royal-blue text-h2 font-semibold mt-8 text-center">
                          <div
                            className="relative"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(
                                message.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
                              ),
                            }}
                          />
                        </Heading>
                        <CustomLink
                          variant="green-right-arrow"
                          anchor={{ title: 'Return to Dashboard', url: '/member-portal' }}
                          otherClasses="mt-[4rem]"
                        />
                      </div>
                      :
                      <>
                        <Heading
                          type="h2"
                          otherClasses="text-h3 font-manrope font-semibold mb-12 text-brand-royal-blue"
                        >
                          Account Information
                        </Heading>
                        <div className="flex flex-wrap justify-center">
                          <div className="flex gap-x-8 w-full">
                            <div className="sm:w-1/2 mb-8">
                              <label htmlFor="first-name" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                                First name<span className="text-brand-warning pl-2">*</span>
                              </label>
                              <input
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                                type="text"
                                id="first-name"
                                value={accountInfo.firstName}
                                onChange={(e) => {
                                  setAccountInfo((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                  }));
                                }}
                                required
                              />
                            </div>
                            <div className="sm:w-1/2 mb-8">
                              <label className="block text-p2 text-brand-black-200 font-semibold mb-3" htmlFor="last-name">
                                Last name <span className="text-brand-warning pl-2">*</span>
                              </label>
                              <input
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                                type="text"
                                id="last-name"
                                value={accountInfo.lastName}
                                onChange={(e) => {
                                  setAccountInfo((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                  }));
                                }}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-x-8 w-full">
                            <div className="sm:w-1/2 mb-8">
                              <label htmlFor="organization" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                                Organization
                              </label>
                              <input
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                                type="text"
                                id="organization"
                                value={accountInfo?.organization}
                                onChange={(e) => {
                                  setAccountInfo((prev) => ({
                                    ...prev,
                                    organization: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                            <div className="sm:w-1/2 mb-8">
                              <label className="block text-p2 text-brand-black-200 font-semibold mb-3" htmlFor="title">
                                Title
                              </label>
                              <input
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                                type="text"
                                id="title"
                                value={accountInfo?.title}
                                onChange={(e) => {
                                  setAccountInfo((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-x-8 w-full">
                            <div className="sm:w-full mb-8">
                              <label htmlFor="phone-number" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                                Phone Number
                              </label>
                              <input
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                                type="text"
                                id="phone-number"
                                value={formatPhoneNumber(accountInfo.phoneNumber)}
                                maxLength={14}
                                minLength={14}
                                onChange={(e) => {
                                  formatToPhone(e);
                                  setAccountInfo((prev) => ({
                                    ...prev,
                                    phoneNumber: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-full block text-p2 text-brand-black-200 font-semibold mb-3">Email Frequency</div>
                          <div className="w-full">
                            <label className="flex items-center mr-4 lg:mr-6 mb-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className={clsx(
                                  styles.customCheckbox,
                                  'mr-2 min-h-7 min-w-7'
                                )}
                                name="emailFrequency"
                                value="Daily"
                                checked={checkedEFState[0]}
                                onChange={() => handleEFCheckboxChange(0)}
                              />
                              <span className="text-brand-black-200 text-p2 pt-1 pl-2">I'd like daily emails that summarize all new content</span>
                            </label>
                            <label className="flex items-center mr-4 lg:mr-6 mb-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className={clsx(
                                  styles.customCheckbox,
                                  'mr-2 min-h-7 min-w-7'
                                )}
                                name="emailFrequency"
                                value="Weekly"
                                checked={checkedEFState[1]}
                                onChange={() => handleEFCheckboxChange(1)}
                              />
                              <span className="text-brand-black-200 text-p2 pt-1 pl-2">I'd like weekly emails that summarize all new content</span>
                            </label>
                          </div>
                          {error && (
                            <div
                              className="w-full mt-4 relative text-red-500"
                              dangerouslySetInnerHTML={{
                                __html: sanitize(
                                  error.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
                                ),
                              }}
                            />
                          )}
                        </div>
                      </>
                  }

                </div>
                {!message && <div className={"mt-12 bg-brand-teal text-center"}>
                  <button
                    className="mx-auto flex items-center gap-x-2 justify-center px-6 pt-4 pb-3.5 text-lg tracking-[0.006rem] font-medium rounded-lg border border-brand-blue text-white bg-brand-blue w-96 hover:bg-brand-blue/90 transition-all hover:gap-x-4"
                    color="brand-orange"
                    type="submit"
                  >
                    <span>Save Changes</span>
                    <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                  </button>
                </div>}

              </form>
              {isLoading ? (
                <div className="fixed z-50 inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                  <Loading />
                </div>
              ) : (
                ""
              )}
            </div>
          </AuthContent>
        </div>
      </>
    </>
  );
}
