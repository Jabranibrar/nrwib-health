import React from 'react'
import clsx from 'clsx'
import styles from './Loader.module.scss'

export const Loader = ({ otherClasses }) => {
  const loaderClasses = clsx(
    otherClasses,
    'fixed left-1/2 top-1/2 z-100 -translate-x-1/2 -translate-y-1/2'
  )

  return (
    <>
      <div
        className='fixed left-0 top-0 right-0 bottom-0 bg-white bg-opacity-70 z-50'
        // onClick={onClick || (() => {})}
      />

      <div className={loaderClasses} data-testid='loader'>
        <span
          className={`w-4 h-4 inline-block z-50 my-36 mx-auto bg-brand-blue-dark rounded-full align-middle ${styles.bubble1}`}
        />
        <span
          className={`w-4 h-4 inline-block z-50 my-36 mx-auto bg-brand-blue-dark rounded-full align-middle ${styles.bubble2}`}
        />
        <span
          className={`w-4 h-4 inline-block z-50 my-36 mx-auto bg-brand-blue-dark rounded-full align-middle ${styles.bubble3}`}
        />
      </div>
    </>
  )
}

export default Loader
