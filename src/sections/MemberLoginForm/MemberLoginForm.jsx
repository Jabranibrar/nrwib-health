import React, { useRef, useState } from 'react';
import NextImage from '@/src/components/NextImage';
import Heading from '@/src/components/Heading';
import useAuth from '@/src/hooks/useAuth';
import { useMutation } from '@apollo/client';
import LOGIN from '@/src/mutations/login';
import { GET_USER } from '@/src/hooks/useAuth';
import { isEmail } from '@/src/utils/validator/email';
import Link from 'next/link';
import Loading from '@/src/components/Loading';
import Icon from '@/src/components/Icon';
import UnAuthContent from '@/src/components/UnAuthContent';
import Image from 'next/image';

const MemberLoginForm = (props) => {
  const { image } = props;
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logIn, { loading, data: userData, error: loginError }] = useMutation(LOGIN, {
    refetchQueries: [{ query: GET_USER }]
  });

  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    formRef.current?.reportValidity();
    if (!isEmail(formData.email ?? '')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await logIn({
        variables: {
          login: formData.email ?? '',
          password: formData.password ?? ''
        }
      });

      setIsLoading(false);
      if (
        user &&
        user?.roles?.nodes?.[0]?.name !== 'administrator' &&
        user?.profileField?.adminApproved !== 1
      ) {
        setError('Your account is not approved yet. Please contact the administrator.');
        return;
      }
    } catch (error) {
      setIsLoading(false);
      if (['incorrect_password', 'invalid_email', 'invalid_username'].includes(error.message)) {
        setError('The email or the password is incorrect.');
      } else {
        setError('Something went wrong.');
      }
    }
  }

  return (
    <section data-testid="member-login-form" className={`overflow-hidden`}>
      <div className={'block bg-brand-neutral-2 relative'}>
        <UnAuthContent>
          <div className={'flex items-center justify-center flex-wrap'}>
            <div className={'w-full lg:w-[55%]'}>
              <div className="py-5 px-8 lg:px-0 lg:py-10 relative lg:left-5 lg:right-5 lg:left-24 lg:w-[60%] xl:left-[calc(50vw-620px)]">
                <div className={'w-full'}>
                  <Heading
                    type="h2"
                    otherClasses="text-h2 lg:text-h1 font-semibold font-manrope text-brand-royal-blue text-left w-full"
                  >
                    Login
                  </Heading>
                  <div className={'relative w-full h-[1px] bg-brand-neutral-5 my-8'} />
                </div>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="flex flex-wrap justify-center mb-4">
                    <div className="w-full mb-7">
                      <label
                        htmlFor="email"
                        className="block text-p2 text-brand-black-200 font-semibold mb-3"
                      >
                        Email<span className="text-brand-warning pl-2">*</span>
                      </label>
                      <input
                        type="email"
                        className="focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg"
                        id="email"
                        placeholder="Enter Email"
                        value={formData.email ?? ''}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (isEmail(e.target.value)) {
                            setError('');
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="w-full mb-7">
                      <label
                        htmlFor="password"
                        className="block text-p2 text-brand-black-200 font-semibold mb-3"
                      >
                        Password<span className="text-brand-warning pl-2">*</span>
                      </label>
                      <input
                        type="password"
                        className="focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg"
                        id="password"
                        placeholder="Enter Password"
                        value={formData.password ?? ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="text-right font-semibold text-brand-teal w-full mb-5">
                      <Link className="underline text-p2" href="/member-forgot-password/">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <div className="mb-8">
                    <button
                      type={'submit'}
                      className={
                        'mt-4 !py-5 px-4 !font-normal teal-right-arrow-button !w-full !text-center flex items-center justify-center'
                      }
                    >
                      <span>Login</span>
                      <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                    </button>
                  </div>
                  {(error || loginError) && (
                    <div className="w-full absolute text-red-500">
                      {error || loginError.message}
                    </div>
                  )}
                  {isLoading ? (
                    <div className="fixed z-50 inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : (
                    ''
                  )}
                </form>
              </div>
            </div>
            <div className={'w-full lg:w-[45%] h-96 lg:h-[600px]'}>
              <NextImage {...image} otherClasses="w-full h-full object-cover object-center" />
            </div>
          </div>
        </UnAuthContent>
      </div>
    </section>
  );
};

export default MemberLoginForm;

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
