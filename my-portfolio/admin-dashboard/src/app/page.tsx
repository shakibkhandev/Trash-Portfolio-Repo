"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Cookies from "js-cookie";
import { BarChart3, Shield, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/access`,
        {
          username: username,
          password: password,
        }
      );

      if (response.data.success) {
        // Set the access token in cookie
        Cookies.set("access_token", response.data.data.access_token, {
          expires: 1, // 1 day
          secure: true,
          sameSite: "strict",
        });

        toast.success("Admin access granted!");
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Invalid admin credentials");
      toast.error("Invalid admin credentials");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="max-w-md mx-auto mb-16">
          <CardHeader>
            <CardTitle className="text-center">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username Section */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Admin Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Section */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Admin Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!username || !password}
              onClick={handleLogin}
            >
              Access Admin Dashboard
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Facts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Management
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                of admin dashboards include user management features
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2FA</div>
              <p className="text-xs text-muted-foreground">
                Two-factor authentication is now standard in modern dashboards
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">90%</div>
              <p className="text-xs text-muted-foreground">
                of businesses use analytics in their admin interfaces
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3s</div>
              <p className="text-xs text-muted-foreground">
                Average load time for optimized admin dashboards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
