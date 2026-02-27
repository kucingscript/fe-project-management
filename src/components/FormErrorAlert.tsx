import { useFormContext } from "react-hook-form";

const FormErrorAlert = () => {
  const {
    formState: { errors },
  } = useFormContext();

  const rootErrorMessage = errors.root?.message as string | undefined;

  if (!rootErrorMessage) {
    return null;
  }

  return (
    <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
      {rootErrorMessage}
    </div>
  );
};

export default FormErrorAlert;
