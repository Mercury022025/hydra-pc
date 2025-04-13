import LoginCard from "@/app/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoginCard />
    </div>
  );
}

/*
If you have email confirmation turned on (the default), a new user will receive an email confirmation after signing up.

Change the email template to support a server-side authentication flow.

Go to the Auth templates page in your dashboard. In the Confirm signup template, change {{ .ConfirmationURL }} to {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email.
*/
