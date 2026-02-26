import { NextResponse } from "next/server";
import { addLead } from "@/lib/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, email, projectType, newsletter } = body;

    // Validate required fields
    if (!name || !mobile || !email || !projectType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create lead entry
    const leadId = await addLead({
      name,
      email,
      phone: mobile,
      source: "Website Enquiry",
      status: "new",
      notes: `Project Type: ${projectType}${newsletter ? " | Subscribed to newsletter" : ""}`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, leadId }, { status: 200 });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
