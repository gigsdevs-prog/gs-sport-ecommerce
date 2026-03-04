// ============================================
// GS SPORT - Reset Password Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';
import { SITE_NAME } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Supabase will exchange the token from the email link automatically
    // via the auth callback or hash fragment. We just need to verify
    // that a session exists.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        // Listen for auth state change (token exchange may be in progress)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setReady(true);
          }
        });
        // Timeout - if no session after 5s, show error
        const timeout = setTimeout(() => {
          if (!ready) {
            toast.error('Invalid or expired reset link. Please request a new one.');
            router.push('/auth/forgot-password');
          }
        }, 5000);
        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Password updated successfully!');
    router.push('/');
    router.refresh();
  };

  if (!ready) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Verifying reset link...</p>
        </div>
      </div>
    );
  }

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
          <p className="mt-2 text-sm text-neutral-500">Set your new password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <Button type="submit" fullWidth loading={loading}>
            Update Password
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/auth/login" className="text-black underline hover:no-underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
