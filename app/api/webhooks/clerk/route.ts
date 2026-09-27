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
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env.local"
    );
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no Svix headers", {
      status: 400,
    });
  }

  // IMPORTANT: Read the original request body.
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
  "svix-id": svixId,
  "svix-timestamp": svixTimestamp,
  "svix-signature": svixSignature,
}) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);

    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log("Clerk webhook received:", {
    id,
    eventType,
  });

  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username ?? "",
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
    };

    const newUser = await createUser(user);

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

  if (eventType === "user.deleted") {
    if (!id) {
      return new Response("User ID is missing", {
        status: 400,
      });
    }
    const deletedUser = await deleteUser(id);

    return NextResponse.json({
      message: "OK",
      user: deletedUser,
    });
  }

  return new Response("OK", {
    status: 200,
  });
}