"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

interface BaseFormItemProps {
  name: string;
  label?: string;
  description?: string;
}

export const InputForm = ({
  name,
  label,
  description,
  valueType,
  className,
  ...props
}: BaseFormItemProps &
  React.ComponentProps<typeof Input> & {
    valueType?: "string" | "number";
    className?: string;
  }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...props}
              {...field}
              onChange={(e) => {
                if (valueType === "number") {
                  const num = parseInt(e.target.value, 10);
                  field.onChange(isNaN(num) ? undefined : num);
                } else {
                  field.onChange(e);
                }
              }}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const TextareaForm = ({
  name,
  label,
  description,
  ...props
}: BaseFormItemProps & React.ComponentProps<typeof Textarea>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} {...props} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SelectForm = ({
  name,
  label,
  description,
  options,
  placeholder,
  valueType,
  className,
  ...props
}: BaseFormItemProps &
  Omit<React.ComponentProps<typeof Select>, "children" | "value"> & {
    options: { value: string | number; label: string }[];
    placeholder?: string;
    valueType?: "string" | "number" | "boolean";
    className?: string;
  }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(value) => {
              if (valueType === "number") {
                const numValue = parseInt(value, 10);
                field.onChange(isNaN(numValue) ? undefined : numValue);
              } else if (valueType === "boolean") {
                field.onChange(value === "true");
              } else {
                field.onChange(value);
              }
            }}
            value={
              field.value === undefined || field.value === null
                ? ""
                : String(field.value)
            }
            {...props}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem value={String(option.value)} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CheckboxForm = ({
  name,
  label,
  description,
  onCheckedChange: customOnCheckedChange,
  ...props
}: BaseFormItemProps &
  React.ComponentProps<typeof Checkbox> & {
    onCheckedChange?: (
      checked: boolean,
      fieldOnChange: (value: any) => void
    ) => void;
  }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                {...props}
                checked={field.value}
                onCheckedChange={(checked) => {
                  if (customOnCheckedChange) {
                    customOnCheckedChange(!!checked, field.onChange);
                  } else {
                    field.onChange(checked);
                  }
                }}
                id={name}
              />
            </FormControl>
            <label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SwitchForm = ({
  name,
  label,
  description,
  ...props
}: BaseFormItemProps & React.ComponentProps<typeof Switch>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export const FileForm = ({
  name,
  label,
  description,
  ...props
}: BaseFormItemProps & React.ComponentProps<typeof Input>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...restField } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type="file"
              {...restField}
              {...props}
              onChange={(e) => onChange(e.target.files)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const TagsForm = ({
  name,
  label,
  description,
  ...props
}: BaseFormItemProps & React.ComponentProps<typeof Input>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...props}
              value={Array.isArray(field.value) ? field.value.join(",") : ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                let newTags = inputValue.split(/[,，]/);
                if (!(inputValue.endsWith(",") || inputValue.endsWith("，"))) {
                  newTags = newTags.filter(Boolean);
                }

                field.onChange(newTags);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
