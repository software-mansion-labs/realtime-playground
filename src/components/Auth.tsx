import { useSupabaseStore } from "@/store/supabaseStore";
import LoginForm from "./forms/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LoginValues } from "@/schemas/client";

export default function Auth() {
  const { userId, email: userEmail, login, logout } = useSupabaseStore();

  const handleLogin = async ({ email, password }: LoginValues) => {
    await login(email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">User Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        {!userId ? (
          <div className="space-y-3">
            <LoginForm onSubmit={handleLogin} />
            <p className="text-xs text-muted-foreground">
              Tip: Set NEXT_PUBLIC_TEST_USER_EMAIL and
              NEXT_PUBLIC_TEST_USER_PASSWORD in .env.local
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border border-green-600/40 bg-green-950/30 p-3 space-y-1">
              <p className="text-green-400 font-semibold text-xs">
                ✓ Authenticated
              </p>
              <p className="text-xs text-muted-foreground break-all">
                <span className="font-semibold">User ID:</span> {userId}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Email:</span> {userEmail}
              </p>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
