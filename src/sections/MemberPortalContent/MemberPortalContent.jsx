import React from 'react';
import useAuth from '@/src/hooks/useAuth';
import AuthContent from '@/src/components/AuthContent';
import { BlockRenderer } from '@/src/components/BlockRenderer';

const MemberPortalContent = (props) => {
  const { user } = useAuth();
  return (
    <section
      data-testid="member-portal"
      className={`overflow-hidden`}
    >
      <AuthContent>
        <BlockRenderer blocks={props?.blocks} />
      </AuthContent>
    </section>
  );
};

export default MemberPortalContent;
