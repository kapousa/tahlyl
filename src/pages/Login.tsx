import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { USER_LOGIN_ENDPOIN } from "@/configurations/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${USER_LOGIN_ENDPOIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail
                .map((err: any) => `${err.loc.join('.')} - ${err.msg}`)
                .join('; ');
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            }
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        }
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      toast.success('Login successful');

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('token_type', data.token_type || 'bearer');

        // ✅ Navigate to the dashboard
        navigate('/');
      } else {
        toast.error('No access token received');
      }

    } catch (error) {
      toast.error('An error occurred while logging in');
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Login</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="flex items-center justify-between mt-4">
            <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
              Forgot password?
            </Link>
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
