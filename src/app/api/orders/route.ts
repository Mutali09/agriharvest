import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, buyerName, buyerEmail, buyerPhone, message } = body ?? {};

    if (!productId || !buyerName || !buyerEmail || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        productId,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone ?? null,
        message,
      },
    });

    const sellerEmail = product.sellerEmail || process.env.FALLBACK_SELLER_EMAIL;
    if (sellerEmail) {
      const subject = `New order inquiry for ${product.title}`;
      const html = `
        <p>You have a new order inquiry on AgriHarvest.</p>
        <p><strong>Product:</strong> ${product.title}</p>
        <p><strong>Buyer Name:</strong> ${buyerName}</p>
        <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
        ${buyerPhone ? `<p><strong>Buyer Phone:</strong> ${buyerPhone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p>Order ID: ${order.id}</p>
      `;
      await sendMail({ to: sellerEmail, subject, html });
    }

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

