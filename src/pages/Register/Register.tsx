import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";

function Register() {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Welcome to Booking</CardTitle>
        <CardDescription>Register your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="Full name"
                />
                <InputGroupAddon align="inline-start">
                  <UserRound />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup>
                <InputGroupInput id="email" type="email" placeholder="Email" />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <InputGroup>
                <InputGroupInput
                  id="phone"
                  type="tel"
                  placeholder="0849007..."
                />
                <InputGroupAddon align="inline-start">
                  <Phone />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pasword">Password</Label>
              <InputGroup>
                <InputGroupInput
                  type={isShowPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <Eye /> : <EyeOff />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button className="w-full mb-5 cursor-pointer">Register</Button>
        {/* <div className="flex justify-center items-center">
          <Button
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
            variant={"link"}
          >
            Login
          </Button>
        </div> */}
      </CardFooter>
    </Card>
  );
}

export default Register;
