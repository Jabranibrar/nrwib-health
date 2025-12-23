import { useEffect, useState } from 'react';
import { isEmpty, sample } from 'lodash';
import Campaign from '@/src/components/Campaign';
import AnnouncementPanel from '@/src/components/AnnouncementPanel';
import { useRouter } from 'next/router';
import BottomBox from '@/src/components/BottomBox';
import SideBox from '@/src/components/SideBox';

export default function OverlaysSection({ data }) {
  const router = useRouter();
  const [activeOverlay, setActiveOverlay] = useState([]);

  const edges = data?.overlays?.edges ?? [];

  if (!edges) {
    return null;
  }

  const overlaysBatch = edges.map((edge) => edge.node);

  const getLastPartOfUrl = (url) => {
    const parts = url.split('/').filter((part) => part.trim() !== ''); // Remove empty parts
    return parts[parts.length - 1];
  };

  const randomOverlay = () => {
    const overlays = overlaysBatch.filter(
      (overlay) =>
        overlay?.overlayFields?.popUpLocation?.edges?.some(
          (location) =>
            location?.node?.slug === getLastPartOfUrl(router.asPath) ||
            (router.asPath === '/' && location?.node?.slug === 'home')
        ) || !overlay?.overlayFields?.popUpLocation // Include when popUpLocation is null
    );
    setActiveOverlay(sample(overlays));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    randomOverlay();
  }, [router.asPath]);

  return (
    <>
      {!isEmpty(activeOverlay) ? (
        activeOverlay?.overlayFields?.overlayType === 'AnnouncementPanel' ? (
          <AnnouncementPanel data={activeOverlay} />
        ) : activeOverlay?.overlayFields?.overlayType === 'Bottom' ? (
          <BottomBox data={activeOverlay} />
        ) : activeOverlay?.overlayFields?.overlayType === 'SideBox' ? (
          <SideBox data={activeOverlay} />
        ) : (
          <Campaign data={activeOverlay} />
        )
      ) : (
        <></>
      )}
    </>
  );
}
