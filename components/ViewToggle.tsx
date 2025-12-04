'use client';
import React from 'react';
import { Table as TableIcon, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { viewToggleProps } from '@/types/Global.types';

const ViewToggle: React.FC<viewToggleProps> = ({ viewType, setViewType }) => (
  <div className='mb-2 mt-4 flex items-center justify-end'>
    <div className='bg-lightAquaBg flex gap-1 rounded-full p-1 border'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='sm'
              variant={viewType === 'table' ? 'default' : 'ghost'}
              className={`flex items-center justify-center rounded-full px-4 py-2 transition-all duration-150 ${
                viewType === 'table'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setViewType('table')}
              aria-label='Table View'
            >
              <TableIcon className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='text-white'>Table View</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='sm'
              variant={viewType === 'card' ? 'default' : 'ghost'}
              className={`flex items-center justify-center rounded-full px-4 py-2 transition-all duration-150 ${
                viewType === 'card'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setViewType('card')}
              aria-label='Card View'
            >
              <LayoutGrid className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='text-white'>Card View</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

export default ViewToggle;