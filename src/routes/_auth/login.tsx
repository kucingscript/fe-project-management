import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import FormInput from "@/components/FormInput";
import { loginUser } from "@/services/authService";
import Loader from "@/components/Loader";
import { Lock, Mail } from "lucide-react";
import { handleApiError } from "@/lib/apiError";
import AuthInfo from "./-component/authInfo";
import apiClient from "@/lib/api";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search) => {
    if (search.redirect && typeof search.redirect !== "string") {
      throw new Error("Invalid redirect param");
    }
    return {
      redirect:
        typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: Route.id });
  const { setUserCorporate } = useAuthStore();

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const { login } = useAuthStore();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await loginUser(data);
      login(res.data.user, res.data.token);

      const corporateRes = await apiClient.get("/corporates", {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });

      setUserCorporate(corporateRes.data.data);
      console.log(corporateRes.data.data);

      navigate({
        to: redirect || "/",
        search: { redirect: undefined },
        replace: true,
      });
    } catch (error) {
      handleApiError(
        error,
        setError,
        "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AuthInfo
        title="Streamline your workflow with elegance."
        description="Collaborate seamlessly with your team, manage tasks efficiently, and
            deliver outstanding results on time, every time."
      />

      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 md:p-16 lg:p-24 xl:p-32">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Enter your email and password to access your account.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errors.root && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                  {errors.root.message}
                </div>
              )}

              <div className="space-y-4">
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  label="Email"
                  icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                />

                <FormInput
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  label="Password"
                  icon={<Lock className="w-4 h-4 text-muted-foreground" />}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-medium shadow-sm"
              >
                {isSubmitting ? <Loader /> : "Sign In"}
              </Button>
            </form>
          </FormProvider>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
