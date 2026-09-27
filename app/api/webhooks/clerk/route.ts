import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // Clerk Dashboard -> Webhooks -> choose your webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no Svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    const verifiedPayload = await wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    evt = verifiedPayload as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);

    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;
    console.log("CLERK USER CREATED EVENT");
    console.log("Clerk ID:", id);
    console.log("Email:", email_addresses[0]?.email_address);
    console.log("Username:", username);

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username ?? "",
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
    };

    const newUser = await createUser(user);

    // Set public metadata
    if (newUser) {
      const client = await clerkClient();

      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({
      message: "OK",
      user: newUser,
    });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const {
      id,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;

    const user = {
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      username: username ?? "",
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({
      message: "OK",
      user: updatedUser,
    });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({
      message: "OK",
      user: deletedUser,
    });
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", {
    status: 200,
  });
}