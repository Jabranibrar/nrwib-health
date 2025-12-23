import React, { useRef, useState } from 'react';
import NextImage from '@/src/components/NextImage';
import Heading from '@/src/components/Heading';
import { isEmail } from '@/src/utils/validator/email';
import Loading from '@/src/components/Loading';
import Icon from '@/src/components/Icon';
import { useSendPasswordResetEmailMutation } from '@/src/hooks/useSendPasswordResetEmailMutation';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';
import HtmlBlock from '@/src/components/HtmlBlock';

const MemberForgotForm = (props) => {
  const { image, success_message, cta } = props;
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sendPasswordResetEmail, mutationResults] = useSendPasswordResetEmailMutation();

  return (
    <section data-testid="member-forgot-password-form" className={`overflow-hidden`}>
      <div className={'block bg-brand-neutral-2 relative'}>
        <div className={'flex items-center justify-center flex-wrap'}>
          <div className={'w-full lg:w-[55%]'}>
            <div className="py-5 px-8 lg:px-0 lg:py-10 relative lg:left-5 lg:right-5 lg:left-24 lg:w-[60%] xl:left-[calc(50vw-620px)]">
              {!message ? (
                <>
                  <div className={'w-full'}>
                    <Heading
                      type="h2"
                      otherClasses="text-h2 lg:text-h1 font-semibold font-manrope text-brand-royal-blue text-left w-full"
                    >
                      Reset Your Password
                    </Heading>
                    <div className={'relative w-full h-[1px] bg-brand-neutral-5 my-8'} />
                  </div>
                  <form ref={formRef}>
                    <div className="flex flex-wrap justify-center mb-4">
                      <div className="w-full mb-7">
                        <label
                          for="email"
                          className="block text-p2 text-brand-black-200 font-semibold mb-3"
                        >
                          Email<span className="text-brand-warning pl-2">*</span>
                        </label>
                        <input
                          type="email"
                          className="focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg"
                          id="email"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <span className={'text-brand-dark-grey block mt-4'}>
                          Password reset instructions will be sent to your registered email address.
                        </span>
                      </div>
                    </div>
                    <div className="mb-8">
                      <button
                        className={
                          'mt-4 !py-5 px-4 !font-normal teal-right-arrow-button !w-full block !text-center flex items-center justify-center'
                        }
                        onClick={async (event) => {
                          event.preventDefault(); // Prevent form from reloading
                          formRef.current?.reportValidity();
                          setLoading(true);
                          setError('');
                          setMessage('');
                          if (!isEmail(email)) {
                            setError('Please enter a valid email address.');
                            setLoading(false);
                            return;
                          }

                          try {
                            await sendPasswordResetEmail(email);
                            setMessage(success_message);
                            setLoading(false);
                          } catch (e) {
                            setError(e.message);
                            setLoading(false);
                          }
                        }}
                      >
                        <span>Submit</span>
                        <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                      </button>
                      {error && <div className="w-full mt-4 absolute text-red-500">{error}</div>}
                    </div>
                  </form>
                </>
              ) : (
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
              )}
              {loading && (
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

export default MemberForgotForm;

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
