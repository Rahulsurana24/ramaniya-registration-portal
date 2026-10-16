import { NextResponse } from "next/server";
import { googleClients, upload } from "@/lib/google";
import { getSupabaseAdmin, uploadRegistrationImage } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SHEET = process.env.GOOGLE_SHEET_ID || "1_eS00rnkxqXLp_JLMTyYZR5cRFovvEJ_aN-El7248HI";
const PHOTO = process.env.GOOGLE_PHOTO_FOLDER_ID || "1RR76hxtbH0336d_ukGsCyFP1sZ_uEBuh";
const PAYMENT = process.env.GOOGLE_PAYMENT_FOLDER_ID || "1wfj7c9Vh_SY-cTBC2X0Mritn1RHll37E";

export async function POST(req: Request) {
  const f = await req.formData();
  const full = String(f.get("full_name") || "").trim(), father = String(f.get("father_husband_name") || "").trim(), phone = String(f.get("phone") || "").trim(), city = String(f.get("city") || "").trim(), utr = String(f.get("payment_reference") || "").trim();
  const photo = f.get("photo"), payment = f.get("payment_receipt");
  if (!full || !father || !phone || !city || !utr || !(photo instanceof File) || !(payment instanceof File)) return NextResponse.json({ error: "Complete all fields and upload both images." }, { status: 400 });
  const id = `DR-26-${Date.now().toString().slice(-6)}`;
  try {
    const { drive, sheets } = googleClients();
    const photoLink = await upload(drive, photo, `${id}.jpg`, PHOTO), paymentLink = await upload(drive, payment, `${id}_payment.jpg`, PAYMENT);
    await sheets.spreadsheets.values.append({ spreadsheetId: SHEET, range: "A:K", valueInputOption: "USER_ENTERED", requestBody: { values: [[new Date().toISOString(), id, full, father, phone, city, photoLink, utr, paymentLink, "pending", ""]] } });
    return NextResponse.json({ registrationId: id, storage: "google" });
  } catch (googleError) {
    console.error("google_registration_storage_failed", googleError);
    try {
      const supabase = getSupabaseAdmin();
      const { count } = await supabase.from("daughter_registrations").select("id", { count: "exact", head: true });
      const rid = `DR-26-${String((count || 0) + 1).padStart(3, "0")}`;
      const photoUrl = await uploadRegistrationImage(photo, "passport-photos", `${rid}.jpg`), paymentUrl = await uploadRegistrationImage(payment, "payment-screenshots", `${rid}_payment.jpg`);
      const { error } = await supabase.from("daughter_registrations").insert({ registration_id: rid, full_name: full, father_name: father, phone_number: phone, city, passport_photo_url: photoUrl, payment_ref: utr, payment_screenshot_url: paymentUrl, status: "pending" });
      if (error) throw error;
      return NextResponse.json({ registrationId: rid, storage: "supabase" });
    } catch (fallbackError) {
      console.error("supabase_registration_fallback_failed", fallbackError);
      return NextResponse.json({ error: "Could not save registration. Check Google or Supabase configuration." }, { status: 500 });
    }
  }
}
