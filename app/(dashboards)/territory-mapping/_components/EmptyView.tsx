'use client';
import React from 'react';
import { MapPin } from 'lucide-react';

export default function EmptyView({
  title = 'No items',
  description = 'You do not have any items yet.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <MapPin className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900">{title}</h2>

        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </section>
  );
}