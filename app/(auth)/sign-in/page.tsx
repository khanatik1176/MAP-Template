'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import {SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { BaseInput } from '@/components/BaseInput';
import { Circle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TSignInFormInputs } from '@/types/Auth.types';
import Cookies from 'js-cookie';
import { SignInSchema } from '@/schema/Auth.Schema';
import { useMutation } from '@tanstack/react-query';
import { handleSignIn } from '@/helpers/Auth.Api';

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TSignInFormInputs>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const SignInMutation = useMutation({
    mutationFn: handleSignIn,
    onSuccess: (data : any) => {
      Cookies.set('user_data', JSON.stringify(data), { expires: 7 });
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      router.push('/map');
    },
    onError: (error: any) => {
      if (error.message) {
        console.log(error);
        setErrorMessage(error?.response?.data?.message);
      }
    },
  });

  const handleSubmission: SubmitHandler<TSignInFormInputs> = (data) => {
    setErrorMessage(null);
    SignInMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-bgSecondary px-6 md:px-0'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        <h1 className='mb-2 text-start text-2xl font-bold text-black'>
          Sign In
        </h1>
        <div className='mb-6 text-start text-sm text-inputFooterColor'>
          Sign in to continue.
        </div>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit(handleSubmission)}
        >
          <div className='relative mb-2'>
            <Label
              htmlFor='username'
              className='mb-1 block text-sm font-medium'
            >
              User Name
            </Label>
            <BaseInput
              control={control}
              errors={errors}
              name='username'
              id='username'
              type='text'
              placeholder='Enter your username'
              className='w-full'
            />
          </div>
          <div className='relative mb-2'>
            <Label
              htmlFor='password'
              className='mb-1 block text-sm font-medium'
            >
              Password
            </Label>
            <div className='relative'>
              <BaseInput
                control={control}
                errors={errors}
                externalError={errorMessage}
                name='password'
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                className='w-full pr-10'
              />
              <button
                type='button'
                className='absolute right-2 top-2'
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-inputFooterColor' />
                ) : (
                  <Eye className='h-5 w-5 text-inputFooterColor' />
                )}
              </button>
            </div>
          </div>
          <div className='flex w-full flex-col gap-1'>
            <Button type='submit' className='mt-2 w-full'>
              {SignInMutation.isPending ? (
                <Circle className='animate-spin' />
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
        <div className='mt-6 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' className='text-primary underline'>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;