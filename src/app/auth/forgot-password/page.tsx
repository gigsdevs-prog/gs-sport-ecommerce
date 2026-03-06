// ============================================
// GS SPORT - Forgot Password Page
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { SITE_NAME } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-10">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">{SITE_NAME}</h1>
          <p className="mt-2 text-sm text-neutral-500">Reset your password</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-6">
              We&apos;ve sent a password reset link to your email. Please check your inbox.
            </p>
            <Link href="/auth/login" className="text-sm underline hover:no-underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Button type="submit" fullWidth loading={loading}>
                Send Reset Link
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-500">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-black underline hover:no-underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
