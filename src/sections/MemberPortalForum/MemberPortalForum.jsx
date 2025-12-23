import React, { useRef, useEffect } from 'react'
import IframeResizer from '@iframe-resizer/react'

const MemberPortalForum = (props) => {
  const iframeRef = useRef(null)
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(iframeRef?.current?.getElement())
  })

  const onResized = (data) => {
    containerRef?.current?.scrollIntoView()
  }


  return (
    <section className="mb-5">
      <div ref={containerRef} id={"member-portal-forum"} className="container mx-auto">
        <IframeResizer
          forwardRef={iframeRef}
          license="GPLv3"
          checkOrigin={false}
          waitForLoad={true}
          src={process.env.NEXT_PUBLIC_FORUM_URL}
          onResized={onResized}
          style={{ width: '1px', minWidth: '100%', zIndex: '10', position: 'relative', paddingTop: '0',}}
        />
      </div>
    </section>
  );
};

export default MemberPortalForum;
