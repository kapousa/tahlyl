import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { USER_REGISTER_ENDPOIN } from "@/configurations/api";

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${USER_REGISTER_ENDPOIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => `${err.loc.join('.')} - ${err.msg}`).join('; ');
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            }
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
          errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        }
        toast.error(errorMessage);
        return;
      }

      toast.success('Registration successful! You can now log in.');
      navigate('/login'); // Redirect to the login page after successful registration

    } catch (error) {
      toast.error('An error occurred during registration');
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Sign Up</CardTitle>
          </div>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;