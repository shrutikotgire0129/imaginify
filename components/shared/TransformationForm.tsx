"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";

import { CustomField } from "./CustomField";

import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";

import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";

import { updateCredits } from "@/lib/actions/user.actions";

import { getCldImageUrl } from "next-cloudinary";

import { addImage, updateImage } from "@/lib/actions/image.actions";

import { useRouter } from "next/navigation";

import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

import type { IImage } from "@/lib/databse/models/image.model";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

type ImageState = {
  title: string;
  publicId: string;
  width: number;
  height: number;
  secureURL: string;
};

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState<ImageState | null>(
    data
      ? {
          title: data.title,
          publicId: data.publicId,
          width: data.width ?? 0,
          height: data.height ?? 0,
          secureURL: data.secureURL,
        }
      : null,
  );

  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(() => {
      if (data && (type === "restore" || type === "removeBackground")) {
        return transformationType.config;
      }

      return null;
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTransforming, setIsTransforming] = useState(false);

  const [transformationConfig, setTransformationConfig] =
    useState<Transformations | null>(config);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const initialValues =
    data && action === "Update"
      ? {
          title: data.title,
          aspectRatio: data.aspectRatio,
          color: data.color,
          prompt: data.prompt,
          publicId: data.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (!image) {
      setIsSubmitting(false);
      return;
    }

    const finalConfig: Transformations = transformationConfig ?? {};

    const transformationUrl = getCldImageUrl({
      width: image.width,
      height: image.height,
      src: image.publicId,
      ...finalConfig,
    });

    const imageData = {
      title: values.title,
      publicId: image.publicId,
      transformationType: type,
      width: image.width,
      height: image.height,
      config: finalConfig,
      secureURL: image.secureURL,
      transformationURL: transformationUrl,
      aspectRatio: values.aspectRatio,
      prompt: values.prompt,
      color: values.color,
    };

    if (action === "Add") {
      try {
        const newImage = await addImage({
          image: imageData,
          userId,
          path: "/",
        });

        if (newImage) {
          form.reset();
          setImage(data);
          router.push(`/transformations/${newImage._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (action === "Update") {
      if (!data) {
        setIsSubmitting(false);
        return;
      }

      try {
        const updatedImage = await updateImage({
          image: {
            ...imageData,
            _id: data._id.toString(),
          },
          userId,
          path: `/transformations/${data._id}`,
        });

        if (updatedImage) {
          router.push(`/transformations/${updatedImage._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setIsSubmitting(false);
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void,
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState) => {
      if (!prevState) {
        return null;
      }

      return {
        ...prevState,
        width: imageSize.width,
        height: imageSize.height,
      };
    });

    setNewTransformation(transformationType.config);

    onChangeField(value);
  };

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    transformationTypeName: string,
    onChangeField: (value: string) => void,
  ) => {
    debounce(() => {
      setNewTransformation((prevState) => ({
        ...prevState,
        [transformationTypeName]: {
          ...(prevState?.[
            transformationTypeName as keyof Transformations
          ] as object),
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)();

    onChangeField(value);
  };

  const onTransformHandler = () => {
    if (!newTransformation) {
      return;
    }

    setIsTransforming(true);

    const mergedConfig = deepMergeObjects(
      newTransformation,
      transformationConfig ?? {},
    ) as Transformations;

    setTransformationConfig(mergedConfig);

    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  const handleImageChange = (value: string) => {
    form.setValue("publicId", value);

    if (type === "restore" || type === "removeBackground") {
      setNewTransformation(transformationType.config);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full z-50 relative"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value !== null) {
                    onSelectFieldHandler(value, field.onChange);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>

                <SelectContent className="z-50">
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === "remove" ? "Object to remove" : "Object to recolor"
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value ?? ""}
                  className="input-field"
                  onChange={(e) =>
                    onInputChangeHandler(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange,
                    )
                  }
                />
              )}
            />

            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    className="input-field"
                    onChange={(e) =>
                      onInputChangeHandler(
                        "color",
                        e.target.value,
                        "recolor",
                        field.onChange,
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field mt-21">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={handleImageChange}
                setImage={setImage}
                publicId={field.value ?? ""}
                image={image}
                type={type}
              />
            )}
          />

          {image && (
            <TransformedImage
              image={image}
              type={type}
              title={form.getValues().title}
              isTransforming={isTransforming}
              setIsTransforming={setIsTransforming}
              transformationConfig={transformationConfig}
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? "Transforming..." : "Apply Transformation"}
          </Button>

          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting ? "Submitting..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
