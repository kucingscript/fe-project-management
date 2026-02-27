import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserValidation, type RegisterSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";
import Loader from "@/components/Loader";
import {
  Lock,
  Mail,
  Building2,
  User,
  Phone,
  Hash,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  BoomBox,
} from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/services/authService";
import { handleApiError } from "@/lib/apiError";
import FormSelect from "@/components/FormSelect";
import { industryTypeOptions } from "@/constants";
import { useState, useEffect } from "react";
import AuthInfo from "./-component/authInfo";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerUserValidation),
    defaultValues: {
      corporate: {
        name: "",
        email: "",
        code: "",
        phone: "",
        industry_type: "SOFTWARE",
        company_size: 0,
        address: null,
      },
      user: {
        name: "",
        email: "",
        phone: "",
        password: "",
        address: null,
      },
    },
  });

  const { handleSubmit, setError, trigger, watch, setValue, formState } =
    methods;

  const { isSubmitting, errors } = formState;

  const companySize = watch("corporate.company_size");

  useEffect(() => {
    if (typeof companySize === "string") {
      const parsed = parseInt(companySize, 10);
      setValue("corporate.company_size", isNaN(parsed) ? 0 : parsed);
    }
  }, [companySize, setValue]);

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const payload = {
        ...data,
        corporate: {
          ...data.corporate,
          address: data.corporate.address || "",
          industry_type: data.corporate.industry_type || "SOFTWARE",
        },
        user: {
          ...data.user,
          address: data.user.address || "",
        },
      };
      await registerUser(payload);

      toast.success("Registration successful!", {
        description: "Please log in with your new account.",
      });

      navigate({
        to: "/login",
        search: { redirect: undefined },
        replace: true,
      });
    } catch (error) {
      handleApiError(
        error,
        setError,
        "An unexpected error occurred. Please try again later.",
      );
    }
  };

  const nextStep = async () => {
    const isStepValid = await trigger([
      "user.name",
      "user.email",
      "user.phone",
      "user.password",
    ]);

    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const flatErrors = { ...errors };
  if (errors.user) {
    Object.entries(errors.user).forEach(([key, value]) => {
      (flatErrors as any)[`user.${key}`] = value;
    });
  }
  if (errors.corporate) {
    Object.entries(errors.corporate).forEach(([key, value]) => {
      (flatErrors as any)[`corporate.${key}`] = value;
    });
  }

  const patchedMethods = {
    ...methods,
    formState: {
      ...formState,
      errors: flatErrors as any,
    },
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AuthInfo
        title="Join the workspace of the future."
        description="Create your corporate account to start collaborating seamlessly,
            managing tasks efficiently, and delivering outstanding results."
      />

      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 overflow-y-auto max-h-screen">
        <div className="w-full max-w-2xl mx-auto space-y-8 py-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {step === 1 ? "Personal Details" : "Corporate Details"}
            </h2>
            <p className="text-muted-foreground">
              {step === 1
                ? "Let's start by setting up your user profile."
                : "Now, tell us about your organization."}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-primary" : "bg-muted"}`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
            />
          </div>

          <FormProvider {...patchedMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {errors.root && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                  {errors.root.message}
                </div>
              )}

              <div className={step === 1 ? "space-y-6 block" : "hidden"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="user.name"
                    type="text"
                    placeholder="Enter Your Name"
                    label="Full Name"
                    icon={<User className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="user.email"
                    type="email"
                    placeholder="Enter Your Email"
                    label="User Email"
                    icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="user.phone"
                    type="text"
                    placeholder="Phone Number"
                    label="User Phone"
                    icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="user.password"
                    type="password"
                    placeholder="••••••••"
                    label="Password"
                    icon={<Lock className="w-4 h-4 text-muted-foreground" />}
                  />
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-11 text-base font-medium shadow-sm"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className={step === 2 ? "space-y-6 block" : "hidden"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="corporate.name"
                    type="text"
                    placeholder="Enter Corporate Name"
                    label="Corporate Name"
                    icon={
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    }
                  />
                  <FormInput
                    name="corporate.email"
                    type="email"
                    placeholder="Enter Corporate Email"
                    label="Corporate Email"
                    icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="corporate.code"
                    type="text"
                    placeholder="Enter Corporate Code"
                    label="Corporate Code"
                    icon={<BoomBox className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="corporate.phone"
                    type="text"
                    placeholder="Enter Corporate Phone"
                    label="Corporate Phone"
                    icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormInput
                    name="corporate.company_size"
                    type="number"
                    placeholder="Company Size"
                    label="Company Size"
                    icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                  />
                  <FormSelect
                    name="corporate.industry_type"
                    label="Industry Type"
                    placeholder="Select Industry Type"
                    options={industryTypeOptions}
                    icon={
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-11 px-6 sm:px-8 text-base font-medium"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 text-base font-medium shadow-sm"
                  >
                    {isSubmitting ? <Loader /> : "Complete Registration"}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="text-center text-sm text-muted-foreground pb-8">
            Already have an account?{" "}
            <Link
              to="/login"
              search={{ redirect: undefined }}
              className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
