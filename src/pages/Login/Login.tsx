import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Welcome back to Booking</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="pasword">Password</Label>
                <a href="#" className="text-blue-500 cursor-pointer hover:underline ml-auto">
                  Forgot password?
                </a>
              </div>
              <Input
                id="pasword"
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button className="w-full mb-5 cursor-pointer">Login</Button>
        <div className="flex justify-center items-center">
          <p>Don't have an account?</p>
          <Button
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer"
            variant={"link"}
          >
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Login;
