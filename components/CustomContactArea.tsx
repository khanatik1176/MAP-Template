import React, { FC } from 'react';
import { Button } from './ui/button';

type CustomContactAreaProps = {
  isDarkModeActive?: boolean; // Flag for dark mode (optional)
};

const CustomContactArea: FC<CustomContactAreaProps> = ({
  isDarkModeActive,
}) => {
  return (
    <div className='px-6 pt-24 lg:px-36 xl:px-36 2xl:px-[380px]'>
      <div
        className={`${isDarkModeActive ? 'bg-black' : 'rounded-xl border bg-white shadow-2xl'} `}
      >
        <div className='flex flex-col items-center justify-center pb-2 pt-8 text-center'>
          <h1
            className={`text-[42px] font-semibold ${isDarkModeActive ? 'text-white' : 'text-black'}`}
          >
            Let&apos;s <span className='text-primary'>Talk</span>
          </h1>
          <p
            className={`leading-normal text-twelve font-normal lg:text-[20px] ${isDarkModeActive ? 'text-textLight' : 'text-textSecondary'} px-5 lg:px-0`}
          >
            Join 500+ professionals and businesses who trust PentadivIX for
            reliable, affordable web development.
          </p>
          <Button className='my-6'>Contact Us</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomContactArea;
