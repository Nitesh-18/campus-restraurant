export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { CreateOrderRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderRequest = await request.json();

    // Validate order
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }
    if (!orderData.total || orderData.total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total" },
        { status: 400 }
      );
    }

    // Build a user_details object to snapshot customer info on the order.
    // Prefer the profile row if user_id is present, otherwise use provided fields.
    let userDetails: any = null;
    if (orderData.user_id) {
      try {
        const { data: profile, error: profileErr } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, phone_number, address')
          .eq('id', orderData.user_id)
          .maybeSingle();
        if (profile && !profileErr) {
          userDetails = profile;
        }
      } catch (err) {
        console.warn('Failed to fetch profile for user_details snapshot:', err);
      }
    }

    // If no profile found, build from provided request fields
    if (!userDetails) {
      userDetails = {
        full_name: orderData.full_name ?? null,
        phone_number: (orderData as any).phone_number ?? null,
        address: orderData.address ?? null,
      };
    }

    // Insert order (guest-friendly) and store the user_details JSONB snapshot
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: orderData.user_id, // nullable for guest
        user_name: orderData.full_name,
        total: orderData.total,
        notes: orderData.notes || null,
        status: "new",
        user_details: userDetails,
      })
      .select(
            `
        *,
        profiles (
          id,
          full_name,
          phone_number,
          address
        ),
        order_items (
          id,
          quantity,
          unit_price,
          products (
            id,
            name,
            image_url
          )
        )
      `
      )
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order", detail: orderError.message },
        { status: 500 }
      );
    }

    // If the joined profiles object is null, try a direct lookup as a fallback.
    // This can happen if the DB relationship isn't configured in Supabase or
    // if a profile row doesn't exist for the given user_id yet.
    if (!order.profiles && order.user_id) {
      try {
        const { data: profile, error: profileErr } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, phone_number, address')
          .eq('id', order.user_id)
          .maybeSingle();

        if (profile && !profileErr) {
          // attach fetched profile to the order response
          // @ts-ignore - dynamic shape from Supabase
          order.profiles = profile;
        } else if (profileErr) {
          console.warn('Profile lookup failed:', profileErr.message || profileErr);
        }
      } catch (err) {
        console.warn('Unexpected error fetching profile fallback:', err);
      }
    }

    // Map cart items correctly (product_id = item.id)
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    console.log("Order items to insert:", orderItems); // debug

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // rollback order
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items", detail: itemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error in order creation:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error?.message },
      { status: 500 }
    );
  }
}
