'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { BaseInput } from '@/components/BaseInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignUpFormValues } from '@/types/Auth.types';
import { SignUpSchema } from '@/schema/Auth.Schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { handleSignup } from '@/helpers/Auth.Api';



const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
    },
  });

const SignUpMutation = useMutation({
    mutationFn: handleSignup,
    onSuccess: (data) => {
      router.push('/sign-in');
    },
    onError: (error: any) => {
      if (error.message) {
        console.log(error);
        setErrorMessage(error?.response?.data?.message);
      }
    },
  });

  const handleSubmission: SubmitHandler<SignUpFormValues> = (data) => {
    setErrorMessage(null);
    SignUpMutation.mutate(data);
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-bgSecondary px-6 md:px-0">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-start text-2xl font-bold text-black">Sign Up</h1>
        <div className="mb-6 text-start text-sm text-inputFooterColor">
          Join now to start taking notes!
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmission)}>
          <div className="relative mb-2">
            <Label htmlFor="username" className="mb-1 flex items-center gap-1 text-sm font-medium">
              User Name <span className="text-red-500">*</span>
            </Label>
            <BaseInput
              id="username"
              name="username"
              type="text"
              control={control}
              errors={errors}
              placeholder="Enter your user name"
              className="w-full"
            />
          </div>

          <div className="relative mb-2">
            <Label htmlFor="email" className="mb-1 flex items-center gap-1 text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <BaseInput
              id="email"
              name="email"
              type="email"
              control={control}
              errors={errors}
              placeholder="Enter your email"
              className="w-full"
            />
          </div>

          <div className="relative mb-2">
            <Label htmlFor="password" className="mb-1 flex items-center gap-1 text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <BaseInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                control={control}
                errors={errors}
                placeholder="Create a password"
                className="w-full pr-10"
              />
              <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff className="h-5 w-5 text-inputFooterColor" /> : <Eye className="h-5 w-5 text-inputFooterColor" />}
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <Label htmlFor="confirm" className="mb-1 flex items-center gap-1 text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <BaseInput
                id="confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                control={control}
                errors={errors}
                placeholder="Confirm your password"
                className="w-full pr-10"
              />
              <button type="button" className="absolute right-2 top-2" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-5 w-5 text-inputFooterColor" /> : <Eye className="h-5 w-5 text-inputFooterColor" />}
              </button>
            </div>
            {errorMessage && <div className="text-medium absolute mt-1 text-sm text-destructive">{errorMessage}</div>}
          </div>

          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;