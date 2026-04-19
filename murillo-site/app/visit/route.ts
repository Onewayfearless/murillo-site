import { NextResponse } from "next/server";
import twilio from "twilio";

type VisitPayload = {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  jobType?: string;
  details?: string;
  preferredTime?: string;
  date?: string;
};

function cleanPhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VisitPayload;

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = cleanPhone(String(body.phone || "").trim());
    const address = String(body.address || "").trim();
    const jobType = String(body.jobType || "").trim();
    const details = String(body.details || "").trim();
    const preferredTime = String(body.preferredTime || "").trim();

    if (!name || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone, and address are required.",
        },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const ownerPhone = process.env.OWNER_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone || !ownerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Twilio env variables are missing.",
        },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    const ownerMessage =
      `New visit request for Murillo Renovations LLC\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || "N/A"}\n` +
      `Address: ${address}\n` +
      `Job Type: ${jobType || "N/A"}\n` +
      `Preferred Time: ${preferredTime || "N/A"}\n` +
      `Details: ${details || "N/A"}`;

    const customerMessage =
      `Murillo Renovations LLC: your visit request has been received.\n` +
      `We got your request for ${address}.` +
      `${preferredTime ? ` Preferred time: ${preferredTime}.` : ""}` +
      ` We will follow up soon.`;

    const results = await Promise.allSettled([
      client.messages.create({
        body: ownerMessage,
        from: twilioPhone,
        to: ownerPhone,
      }),
      client.messages.create({
        body: customerMessage,
        from: twilioPhone,
        to: phone,
      }),
    ]);

    const ownerResult = results[0];
    const customerResult = results[1];

    if (ownerResult.status === "rejected" || customerResult.status === "rejected") {
      console.error("Twilio send failed:", results);
      return NextResponse.json(
        {
          success: false,
          error: "Visit saved, but SMS failed. Check Twilio config and verified numbers.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Visit request received and texts sent.",
      ownerSid: ownerResult.value.sid,
      customerSid: customerResult.value.sid,
    });
  } catch (error) {
    console.error("Visit route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error while sending visit request.",
      },
      { status: 500 }
    );
  }
}