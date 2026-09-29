"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const InsufficientCreditsModal = () => {
  const router = useRouter();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="w-[calc(100%-32px)] max-w-[520px] rounded-3xl border-0 bg-white p-6 shadow-2xl md:p-8">
        <AlertDialogHeader className="relative items-center text-center">
          <AlertDialogCancel
            className="absolute right-0 top-0 h-9 w-9 rounded-full border-0 bg-gray-100 p-0 hover:bg-gray-200"
            onClick={() => router.push("/profile")}
          >
            <Image
              src="/assets/icons/close.svg"
              alt="Close"
              width={18}
              height={18}
              className="mx-auto"
            />
          </AlertDialogCancel>

          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-purple-100">
            <Image
              src="/assets/icons/coins.svg"
              alt="Credits"
              width={28}
              height={28}
            />
          </div>

          <AlertDialogTitle className="p-24-bold max-w-[400px] text-dark-600">
            You&apos;re out of credits!
          </AlertDialogTitle>

          <AlertDialogDescription className="p-16-regular max-w-[410px] text-center leading-7 text-dark-400">
            You&apos;ve used all your available credits. Get more credits to
            continue creating and transforming amazing images.
          </AlertDialogDescription>

          <div className="mt-3 flex w-full justify-center overflow-hidden rounded-2xl bg-purple-50 px-4 pt-4">
            <Image
              src="/assets/images/stacked-coins.png"
              alt="Stacked coins"
              width={462}
              height={122}
              className="h-auto w-full max-w-[380px] object-contain"
            />
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <AlertDialogCancel
            className="m-0 h-11 w-full rounded-full border border-purple-200 bg-white px-6 text-sm font-semibold text-dark-400 hover:bg-purple-50 sm:w-auto sm:min-w-[150px]"
            onClick={() => router.push("/profile")}
          >
            No, Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="m-0 h-11 w-full rounded-full bg-purple-gradient bg-cover px-6 text-sm font-semibold text-white hover:opacity-90 sm:w-auto sm:min-w-[170px]"
            onClick={() => router.push("/credits")}
          >
            Get More Credits
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
