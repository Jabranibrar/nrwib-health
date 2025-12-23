import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/src/hooks/useAuth";
import Loading from "@/src/components/Loading";

export default function AuthContent({ children }) {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();
  const isRefererPathSet = router?.asPath ?? '';

  // Navigate unauthenticated users to Log In page.
  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push(`/member-login/${isRefererPathSet.includes('event') ? '?eventReferer='+isRefererPathSet : ''}`, "/member-login/");
    }
  }, [loggedIn, loading, router]);

  if (loggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="py-40 text-center">
      <Loading />
    </div>
  );
}
