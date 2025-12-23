import { useEffect } from "react";
import AuthContent from '@/src/components/AuthContent';
import { useRouter } from 'next/router';
import { useLogoutMutation } from '@/src/mutations/logout';

export default function Logout({ data }) {
  const router = useRouter();
  const { logoutMutation } = useLogoutMutation();

  useEffect(() => {
    const logoutAndRedirect = async () => {
      await logoutMutation();
      setTimeout(() =>
        window.location.href = '/member-portal'
    , 50);
    };

    logoutAndRedirect();
  }, [logoutMutation, router]);

  return (
    <div className="min-h-screen bg-brand-neutral-3 flex items-center justify-center">
      <AuthContent />
    </div>
  );
}

export async function getStaticProps() {
  const defaultProps = {
    props: {
      data: {},
    },
    revalidate: false,
  };
  return defaultProps;
}
