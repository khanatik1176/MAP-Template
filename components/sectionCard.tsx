import Image from 'next/image';
import React, { FC } from 'react';

interface SectionCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const SectionCard: FC<SectionCardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col justify-center p-2 flex-grow'>
        <Image src={imageSrc} alt={title} width={380} height={380} />
        <p className='pt-5 text-[32px] font-semibold text-primary'>{title}</p>
        <p className='flex-grow pt-4 text-[16px] font-normal text-primary'>
          {description}
        </p>
      </div>
    </div>
  );
};

export default SectionCard;