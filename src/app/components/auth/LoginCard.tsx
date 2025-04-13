"use client";

import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

function LoginCard() {
  const { user, loading } = useAuth();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    login(formData);
  }

  if (loading) return <p>Loading...</p>;
  if (user) return <Link href="/admin">Dashboard</Link>;

  return (
    <Card className="w-full h-fit max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Sign in to your account
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Enter your email and password below to login.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default LoginCard;
