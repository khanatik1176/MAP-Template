import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/sidebar';
import Providers from '@/components/providers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ACI MAP',
  description: 'Performance Automation for ACI MAP Team',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get('user_data')?.value;
  const accessTokenPassed = accessToken ? JSON.parse(decodeURIComponent(accessToken)) : null;

  // if (!accessTokenPassed) {
  //   redirect('/sign-in');
  // }

  return (
    <div className={inter.className}>
      <Providers>
        <Sidebar>{children}</Sidebar>
      </Providers>
      <Toaster />
    </div>
  );
}
