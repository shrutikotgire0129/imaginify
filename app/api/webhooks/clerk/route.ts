import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user.actions";

export async function POST(req: NextRequest) {
    try {
    const evt = await verifyWebhook(req);

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

      const email = email_addresses[0]?.email_address;

      if (!email) {
        return new Response("User email is missing", {
          status: 400,
        });
      }

      const user = {
        clerkId: id,
        email,
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
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return new Response("Webhook verification or processing failed", {
      status: 400,
    });
  }
}