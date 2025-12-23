import { useState, useEffect } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import BackToTopIcn from '../../images/back-to-top.svg';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      let timer = null;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShow(window.scrollY > 100);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed right-2.5 bottom-5 z-[1000] cursor-pointer inline-block transition duration-500 border-2 border-brand-blue rounded-full',
        show ? 'visible opacity-100' : 'invisible opacity-0'
      )}
      onClick={backToTop}
    >
      <Image src={BackToTopIcn} width={40} height={40} alt="Back to Top" />
    </div>
  );
}
