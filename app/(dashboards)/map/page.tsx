import React, { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import BreadcrumbWithAvatar from '@/components/BreadCrumbiwthAvatar';
import PageHeading from '@/components/pageHeading';
import { Circle } from 'lucide-react';
import MapConent from './_components/MapContent';

export default function Page() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-lg font-medium animate-spin"><Circle/></div>
          </div>
        }
      >
        <MapConent />
      </Suspense>
    </div>
  );
}