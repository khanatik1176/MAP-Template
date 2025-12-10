'use client';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModeProvider } from '@/contexts/ModeContext';
import { UserProvider } from '@/contexts/UserContext';
import { TerritoryProvider } from '@/contexts/TerritoryContext';

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ModeProvider>
        <UserProvider>
        <TerritoryProvider>
        {children}
        </TerritoryProvider>
        </UserProvider>
      </ModeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
