import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useUpdateUserMutation } from "@/src/hooks/useUpdateUserMutation";
import useAuth, { GET_USER } from "@/src/hooks/useAuth";
import LOGIN from "@/src/mutations/login";
import { validatePassword } from "@/src/utils/validator/password";
import { sanitize } from "@/src/utils/miscellaneous";
import Loading from "@/src/components/Loading";
import Heading from '@/src/components/Heading';
import Icon from '@/src/components/Icon';
import AuthContent from '@/src/components/AuthContent';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function MemberUpdatePasswordForm() {
  const { user: viewer } = useAuth();
  const formRef = useRef(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // For toggling current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // For toggling new password visibility
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // For toggling confirm password visibility
  const router = useRouter();
  const [logIn, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN,
    {
      refetchQueries: [{ query: GET_USER }],
    }
  );

  const [updateUser, { loading: updateUserLoading }] = useUpdateUserMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    formRef.current?.reportValidity();
    setError("");
    setMessage("");

    if (!currentPassword) {
      setError("Current password is required");
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
      await logIn({
        variables: {
          login: viewer?.email ?? "",
          password: currentPassword,
        },
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.message === "incorrect_password"
          ? "The current password entered is incorrect."
          : err.message || "An error occurred."
      );
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({
        id: viewer?.id,
        password,
      });

      setIsLoading(false);
      setError("");
      setMessage("Password reset successfully. Redirecting....");
      router.push('/member-portal/');
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }

    setCurrentPassword("");
    setPassword("");
    setPasswordConfirm("");
  }

  return (
    <>
      <div className="w-full px-12 py-16 bg-brand-teal">
        <AuthContent>
          <div className={"relative max-w-5xl mx-auto"}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className={"bg-brand-neutral-3 p-12"}>
                <Heading
                  type="h2"
                  otherClasses="text-h3 font-manrope font-semibold mb-12 text-brand-royal-blue"
                >
                  Reset Your Password
                </Heading>
                <div className="flex flex-wrap justify-center">
                  <div className="w-full mb-8">
                    <label htmlFor="current-password" className="block text-p2 text-brand-black-200 font-semibold mb-3">
                      Current Password<span className="text-brand-warning pl-2">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                        }}
                        className='focus:outline-none focus-visible:outline-none w-full bg-white border border-brand-neutral-5 h-[50px] pt-2.5 pb-2 px-4 rounded text-brand-dark-grey placeholder:text-brand-dark-grey text-lg'
                        placeholder='Enter your current password'
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-4 flex items-center"
                      >
                        {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </button>
                    </div>

                  </div>
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
              <div className={"mt-12 bg-brand-teal text-center"}>
                <button
                  className="mx-auto flex items-center gap-x-2 justify-center px-6 pt-4 pb-3.5 text-lg tracking-[0.006rem] font-medium rounded-lg border border-brand-blue text-white bg-brand-blue w-96 hover:bg-brand-blue/90 transition-all hover:gap-x-4"
                  color="brand-orange"
                  type="submit"
                >
                  <span>Submit</span>
                  <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                </button>
              </div>
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
  );
}
