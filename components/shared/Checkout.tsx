"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";
import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      toast.add({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        type: "success",
        timeout: 5000,
      });
    }

    if (query.get("canceled")) {
      toast.add({
        title: "Order canceled!",
        description:
          "Continue to shop around and checkout when you're ready",
        type: "error",
        timeout: 5000,
      });
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <form action={onCheckout}>
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover text-white"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;