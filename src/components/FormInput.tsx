import {
  useFormContext,
  type FieldError,
  type Path,
  Controller,
} from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormInputTypes<T extends Record<string, any>> {
  type: "text" | "email" | "password" | "number" | "textarea" | "date";
  placeholder?: string;
  name: Path<T>;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  minDate?: Date;
}

const FormInput = <T extends Record<string, any>>(props: FormInputTypes<T>) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<T>();
  const fieldError = errors[props.name] as FieldError | undefined;

  const InputComponent = props.type === "textarea" ? Textarea : Input;

  return (
    <div>
      {props.label && (
        <Label htmlFor={props.name}>
          {props.label}
          {props.required && <span className="text-red-500 -ml-1">*</span>}
        </Label>
      )}

      <div className="relative my-2 ml-1">
        {props.icon && props.type !== "date" && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        {props.suffix && props.type !== "date" && props.type !== "textarea" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm font-medium bg-transparent">
            {props.suffix}
          </div>
        )}

        {props.type === "date" ? (
          <Controller
            name={props.name}
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      props.className,
                    )}
                    disabled={props.disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {field.value ? (
                        format(field.value, "dd MMM yyyy")
                      ) : (
                        <span>{props.placeholder ?? "Pick a date"}</span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={
                      props.disabled ||
                      (props.minDate ? { before: props.minDate } : undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        ) : (
          <InputComponent
            id={props.name}
            type={props.type}
            className={cn(
              "border border-transparent focus:border-primary focus:ring-primary focus:ring-2 focus:outline-none",
              props.icon ? "pl-10" : "",
              props.suffix ? "pr-8" : "",
              props.className,
            )}
            min={props.type === "number" ? 0 : undefined}
            onKeyDown={(e) => {
              if (
                props.type === "number" &&
                (e.key === "-" || e.key === "e" || e.key === "E")
              ) {
                e.preventDefault();
              }
            }}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onWheel={(e) =>
              props.type === "number" && (e.target as HTMLElement).blur()
            }
            {...register(props.name)}
          />
        )}
      </div>

      {fieldError && (
        <p className="text-xs mt-2 text-red-500">{fieldError.message}</p>
      )}
    </div>
  );
};

export default FormInput;
