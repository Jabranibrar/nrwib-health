import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/src/hooks/useAuth";
import Loading from "@/src/components/Loading";

export default function UnAuthContent({ children }) {
  const { loggedIn, loading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && loggedIn) {
      router.push('/member-portal/');
    }
  }, [loggedIn, loading, router]);

  if (!loggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="py-40 text-center">
      <Loading />
    </div>
  );
}
