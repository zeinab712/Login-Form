import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type formProps = {
  includeFirstName?: boolean;
  includeLastName?: boolean;
  includeEmail?: boolean;
  includePassword?: boolean;
  includeConfirmPassword?: boolean;
  onSubmit: (data: FormValues) => void;
  header: string;
  txt: string;
};

const buildSchema = (
  includeFirstName?: boolean,
  includeLastName?: boolean,
  includeEmail?: boolean,
  includePassword?: boolean,
  includeConfirmPassword?: boolean
) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  if (includeFirstName) {
    shape.firstName = z.string().min(2, "First name is required");
  }

  if (includeLastName) {
    shape.lastName = z.string().min(2, "Last name is required");
  }
  if (includeEmail) {
    shape.email = z.string().email("Enter a valid email address");
  }
  if (includePassword) {
    shape.password = z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^a-zA-Z0-9]/, "Must include a special character");
  }

  if (includeConfirmPassword) {
    shape.confirmPassword = z.string();
  }

  let schema = z.object(shape);

  // Password confirmation
  if (includePassword && includeConfirmPassword) {
    schema = schema.refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }

  return schema;
};

const Form: React.FC<formProps> = ({
  includeFirstName,
  includeLastName,
  includeEmail,
  includePassword,
  includeConfirmPassword,
  onSubmit,
  header,
  txt,
}) => {
  const formSchema = buildSchema(
    includeFirstName,
    includeLastName,
    includeEmail,
    includePassword,
    includeConfirmPassword
  );
  type FormValues = z.infer<typeof formSchema>;

  // React Hook Form
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
    <div className="min-h-full w-full flex items-center justify-center px-4 my-4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-md bg-white/10 rounded-xl shadow-lg p-8 space-y-2 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="w-13 h-13 mb-4 text-[#2d85f0]"
            fill="currentColor"
            viewBox="0 0 30.586 30.586"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-546.269 -195.397)">
              <path d="M572.138,221.245a15.738,15.738,0,0,0-21.065-.253l-1.322-1.5a17.738,17.738,0,0,1,23.741.28Z" />
              <path d="M561.464,204.152a4.96,4.96,0,1,1-4.96,4.96,4.966,4.966,0,0,1,4.96-4.96m0-2a6.96,6.96,0,1,0,6.96,6.96,6.96,6.96,0,0,0-6.96-6.96Z" />
              <path d="M561.562,197.4a13.293,13.293,0,1,1-13.293,13.293A13.308,13.308,0,0,1,561.562,197.4m0-2a15.293,15.293,0,1,0,15.293,15.293A15.293,15.293,0,0,0,561.562,195.4Z" />
            </g>
          </svg>

          <h2 className="text-2xl font-bold">{header}</h2>
          <h2 className="text-gray-300 text-sm mb-4">{txt}</h2>
        </div>

        {includeFirstName && (
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <div className="relative w-full">
              <input
                type="text"
                {...register("firstName")}
                className="w-full border border-[#1957a4] pl-10 py-3 rounded-lg bg-white/10 focus:ring-2 focus:ring-[#2d85f0] focus:outline-none transition duration-300"
                placeholder="Enter your first name"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d85f0] pointer-events-none"
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
        )}

        {includeLastName && (
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <div className="relative w-full">
              <input
                type="text"
                {...register("lastName")}
                className="w-full border border-[#1957a4] pl-10 py-3 rounded-lg bg-white/10 focus:ring-2 focus:ring-[#2d85f0] focus:outline-none transition duration-300"
                placeholder="Enter your last name"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d85f0] pointer-events-none"
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        )}

        {includeEmail && (
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative w-full">
              <input
                type="email"
                {...register("email")}
                className="w-full border border-[#1957a4] px-10 py-3 rounded-lg bg-white/10 focus:ring-2 focus:ring-[#2d85f0] focus:outline-none transition duration-300"
                placeholder="Enter your email"
              />
              <svg
                width="20px"
                height="20px"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="style=linear">
                  <g id="email">
                    <path
                      d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                      stroke="#2d85f0"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.7698 7.7688L13.2228 12.0551C12.5025 12.6116 11.4973 12.6116 10.777 12.0551L5.22998 7.7688"
                      stroke="#2d85f0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                </g>
              </svg>
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        )}

        {includePassword && (
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative w-full">
              <input
                type="password"
                {...register("password")}
                className="w-full border border-[#1957a4] px-10 py-3 rounded-lg bg-white/10 focus:ring-2 focus:ring-[#2d85f0] focus:outline-none transition duration-300"
                placeholder="Enter your password"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d85f0] pointer-events-none"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17,9V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z" />
              </svg>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        )}

        {includeConfirmPassword && (
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <div className="relative w-full">
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full border border-[#1957a4] px-10 py-3 rounded-lg bg-white/10 focus:ring-2 focus:ring-[#2d85f0] focus:outline-none transition duration-300"
                placeholder="Confirm your password"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d85f0] pointer-events-none"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17,9V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z" />
              </svg>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r mt-7 from-[#1957a4] to-[#2d85f0] text-white py-3 rounded-lg hover:from-[#2d85f0] hover:to-[#1957a4] transition duration-300 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
