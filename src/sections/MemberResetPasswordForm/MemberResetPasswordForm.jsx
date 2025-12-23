import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Heading from '@/src/components/Heading';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { validatePassword } from '@/src/utils/validator/password';
import { sanitize } from '@/src/utils/miscellaneous';
import Icon from '@/src/components/Icon';
import { useRouter } from 'next/router';
import NextImage from '@/src/components/NextImage';
import { useResetUserPasswordMutation } from '@/src/hooks/useResetUserPasswordMutation';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';

const MemberResetPasswordForm = (props) => {
  const { image, success_message, cta } = props;
  const router = useRouter();
  const { key, login } = router.query;
  const [resetUserPassword, { loading }] = useResetUserPasswordMutation();
  const formRef = useRef(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // For toggling new password visibility
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // For toggling confirm password visibility

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    formRef.current?.reportValidity();
    setError("");
    setMessage("");

    if ((!key || !login)) {
      setError("Invalid link");
      return;
    }


    if (!validatePassword(password)) {
      setError("The password does not meet the requirements.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("The passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetUserPassword(key, login, password);
      setIsLoading(false);
      setError("");
      setMessage("Password reset successfully.");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
    setPassword("");
    setPasswordConfirm("");
  }
  return (
    <section data-testid="reset-password-form" className={`overflow-hidden`}>
      <div className={'block bg-brand-neutral-2 relative'}>
        <div className={'flex items-center justify-center flex-wrap'}>
          <div className={'w-full lg:w-[55%]'}>
            <div className="py-5 px-8 lg:px-0 lg:py-10 relative lg:left-5 lg:right-5 lg:left-24 lg:w-[60%] xl:left-[calc(50vw-620px)]">
              {
                message ? (
                    <div className="w-full">
                      <div className="py-16 lg:px-10 px-5 bg-white flex justify-center items-center flex-col">
                        <Image
                          src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Secondary_Stacked_FullColor-1.svg"
                          alt="logo image"
                          height={121}
                          width={309}
                          className="h-[7.563rem] w-[19.313rem]"
                        />
                        <HtmlBlock
                          content={success_message}
                          className="text-brand-royal-blue text-h2 font-semibold mt-8 text-center"
                        />
                        {cta ? (
                          <CustomLink variant="green-right-arrow" anchor={cta} otherClasses="mt-8" />
                        ) : null}
                      </div>
                    </div>
                )
                :
                  (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                    >
                      <div className={"relative"}>
                        <Heading
                          type="h2"
                          otherClasses="text-h2 lg:text-h1 font-semibold font-manrope text-brand-royal-blue text-left w-full"
                        >
                          Reset Your Password
                        </Heading>
                        <div className='relative w-full h-[1px] bg-brand-neutral-5 my-8'/>
                        <div className="flex flex-wrap justify-center">
                          <div className="w-full mb-8">
                            <label htmlFor="password" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                              New Password<span className="text-brand-warning pl-2">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                  const newPassword = e.target.value;
                                  setPassword(newPassword);
                                  if (!validatePassword(newPassword)) {
                                    setError("The password does not meet the requirements");
                                    return;
                                  }

                                  setError("");
                                }}
                                placeholder="Enter new password"
                                required
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-4 flex items-center"
                              >
                                {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                              </button>
                            </div>

                            <div className={"password-requirement"}>
                              <p className={"mt-4 text-brand-black-200"}>Password Must:</p>
                              <ul className={"list-disc list-inside pl-4 mt-3 text-brand-black-200"}>
                                <li className={"mb-2"}>Have at least 6 characters</li>
                                <li className={"mb-2"}>Have at least 1 number (1, 2, 3...)</li>
                              </ul>
                            </div>
                          </div>
                          <div className="w-full">
                            <label htmlFor="passwordConfirm" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                              Confirm New Password<span className="text-brand-warning pl-2">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswordConfirm ? "text" : "password"}
                                id="passwordConfirm"
                                value={passwordConfirm}
                                onChange={(e) => {
                                  const newPasswordConfirm = e.target.value;
                                  setPasswordConfirm(newPasswordConfirm);
                                  if (password !== newPasswordConfirm) {
                                    setError("The passwords do not match");
                                    return;
                                  }

                                  setError("");
                                }}
                                placeholder="Confirm New Password"
                                required
                                className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute inset-y-0 right-4 flex items-center"
                              >
                                {showPasswordConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                              </button>
                            </div>

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
                          {message && (
                            <div
                              className="w-full mt-4 relative text-brand-black-200"
                              dangerouslySetInnerHTML={{
                                __html: sanitize(
                                  message.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
                                ),
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className={"mt-12 text-center"}>
                        <button
                          className="mt-4 !py-5 px-4 !font-normal teal-right-arrow-button !w-full !text-center flex items-center justify-center"
                          color="brand-orange"
                          type="submit"
                        >
                          <span>Submit</span>
                          <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                        </button>
                      </div>
                    </form>
                  )
              }
              {isLoading && (
                <div className="fixed z-50 inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <div className={'w-full lg:w-[45%] h-96 lg:h-[600px]'}>
            <NextImage {...image} otherClasses="w-full h-full object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberResetPasswordForm;

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
