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

    // Insert order (guest-friendly)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: orderData.user_id, // nullable for guest
        user_name: user.full_name,
        total: orderData.total,
        notes: orderData.notes || null,
        status: "new",
      })
      .select(
            `
        *,
        profiles (
          full_name
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
