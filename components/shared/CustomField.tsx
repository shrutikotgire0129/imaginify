import React from "react";
import { Control, ControllerRenderProps, FieldPath } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

type FormValues = z.infer<typeof formSchema>;

type CustomFieldProps = {
  control: Control<FormValues> | undefined;
  render: (props: {
    field: ControllerRenderProps<FormValues, FieldPath<FormValues>>;
  }) => React.ReactNode;
  name: FieldPath<FormValues>;
  formLabel?: string;
  className?: string;
};

export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl className="relative">{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
