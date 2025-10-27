import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  }
  
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const {
        title,
        description,
        price, // KES integer
        unit,
        quantity,
        category,
        location,
        imageUrl,
        sellerMobile,
      } = body ?? {};
  
      if (!title || !description || !price || !unit || !quantity || !location) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const product = await prisma.product.create({
        data: {
          title,
          description,
          price: Number(price),
          unit,
          quantity: Number(quantity),
          category: category ?? null,
          location,
          imageUrl: imageUrl ?? null,
          sellerMobile: sellerMobile ?? null,
        },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Delete the product
      await prisma.product.delete({
        where: { id }
      });

      return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }