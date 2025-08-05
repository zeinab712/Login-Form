
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormValues = {
  fullname?: string;
  email?: string;
};

type formProps = {
  includeEmail: boolean;
  includeFullname: boolean;
  onSubmit: (data: FormValues) => void;
};

const buildSchema = (includeEmail: boolean, includeFullname: boolean) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  if (includeFullname) {
    shape.fullname = z.string().min(1, "Full Name is required");
  }

  if (includeEmail) {
    shape.email = z.string().email("Enter a valid email address");
  }

  return z.object(shape);
};

const Form: React.FC<formProps> = ({
  includeEmail,
  includeFullname,
  onSubmit,
}) => {
  const formSchema = buildSchema(includeEmail, includeFullname);
  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = (data: FormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-cyan-100 to-teal-200 px-4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-cyan-700">Welcome</h2>

        {includeFullname && (
          <div>
            <label className="block mb-1 font-medium text-cyan-900">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullname")}
              className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your full name"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullname.message}
              </p>
            )}
          </div>
        )}

        {includeEmail && (
          <div>
            <label className="block mb-1 font-medium text-cyan-900">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition duration-300 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
