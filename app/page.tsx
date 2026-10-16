"use client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const mainSponsors = [
  ["babulalji-hd.jpg", "श्री बाबूलालजी पालरेचा एवं श्रीमती शांतादेवी पालरेचा"],
  ["mukhya-labharthii-group-1.jpg", "मुख्य एवं स्वागत संरक्षक"],
  ["mukhya-labharthii-group-2.jpg", "रमणिया परिवार"],
  ["shantadevi-hd.jpg", "श्रीमती शांतादेवी पालरेचा"],
];
const committee = [
  ["President", "मिठालालजी बागरेचा"], ["Vice Presidents", "मदनलालजी दांतावाडिया, महावीरकुमारजी पालरेचा"],
  ["Secretary", "प्रकाशचंदजी बालर"], ["Joint Secretary", "सुमेरमलजी बालर"],
  ["Treasurer", "मदनलालजी श्रीश्रीमाल झोटा"], ["Convener", "मदन दांतावाडिया"], ["Co-Convener", "हितेंद्र मुनोत"],
];

function Countdown() {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date("2026-12-27T00:00:00+05:30").getTime();
    const tick = () => { const diff = Math.max(0, target - Date.now()); const days = Math.floor(diff / 86400000); const hours = Math.floor(diff / 3600000) % 24; const minutes = Math.floor(diff / 60000) % 60; const seconds = Math.floor(diff / 1000) % 60; setLeft({ days, hours, minutes, seconds }); };
    tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer);
  }, []);
  return <div className="countdown">{Object.entries(left).map(([label, value]) => <div className="count-box" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

export default function Home() {
  const [data, setData] = useState({ full_name: "", father_husband_name: "", phone: "", city: "", payment_reference: "" });
  const [photo, setPhoto] = useState<File | null>(null), [receipt, setReceipt] = useState<File | null>(null), [preview, setPreview] = useState(""), [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!photo || !receipt) return toast.error("Passport photo and payment receipt are required."); setSaving(true); try { const body = new FormData(); Object.entries(data).forEach(([k, v]) => body.append(k, v)); body.append("photo", photo); body.append("payment_receipt", receipt); const res = await fetch("/api/register", { method: "POST", body }); const json = await res.json(); if (!res.ok) throw new Error(json.error); toast.success(`Registration submitted: ${json.registrationId}`); } catch (error) { toast.error(error instanceof Error ? error.message : "Submission failed"); } finally { setSaving(false); } };
  return <><Toaster /><nav className="navbar"><a className="brand" href="#home">Ramaniya Utsav 2026</a><div className="navlinks"><a href="#home">Home</a><a href="#register">Daughter Registration</a><a href="#sponsors">Sponsors</a><a href="#footer">Venue & Map</a></div><a className="nav-cta" href="#register">Register · ₹500</a></nav>
    <main id="home">
      <section className="hero-panel"><p className="invocation">॥ श्री सुमतिनाथाय नमः ॥</p><h1>Ramaniya Utsav</h1><h2>(Bahan-Betiyan Sang - 2026)</h2><p className="event-line">27, 28, 29 December 2026 · Ramaniya Village, Rajasthan</p><p className="count-label">Time left until the festival begins</p><Countdown /><a className="hero-cta" href="#register">Register Now · ₹500</a></section>
      <section id="register" className="section"><div className="section-heading"><p>Ramaniya Utsav 2026</p><h2>Daughter Registration</h2><span /></div><div className="registration-grid"><form className="card form-card" onSubmit={submit}>{[["Full Name","full_name"],["Father / Husband Name","father_husband_name"],["Contact Phone Number","phone"],["City / Native Place","city"],["Payment UTR / Reference ID","payment_reference"]].map(([label, key]) => <label key={key}>{label}<input required value={data[key as keyof typeof data]} onChange={e => setData({ ...data, [key]: e.target.value })} /></label>)}<label>Passport Size Photo<input required type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0] || null; setPhoto(file); if (file) setPreview(URL.createObjectURL(file)); }} />{preview && <img className="preview" src={preview} alt="Passport preview" />}</label><label>Payment Receipt Screenshot<input required type="file" accept="image/*" onChange={e => setReceipt(e.target.files?.[0] || null)} /></label><button className="submit" disabled={saving}>{saving ? "Submitting…" : "Submit Registration · ₹500"}</button></form><aside className="card payment-card"><h3>Pay Registration Fee</h3><p>Scan the SBI Bharat QR to pay ₹500, then enter your UTR above.</p><img src="/sbi-upi-qr.jpg" alt="SBI payment QR code" /><strong>Registration Fee · ₹500</strong></aside></div></section>
      <section id="sponsors" className="section patterned"><div className="section-heading"><p>Ramaniya Utsav 2026</p><h2>Main & Welcome Patrons</h2><span /></div><p className="lead">We are deeply grateful to all our patrons.</p><h3 className="subheading">Main Patrons</h3><div className="sponsor-grid">{mainSponsors.map(([image, name]) => <article className="sponsor-card" key={image}><img src={`/sponsors/${image}`} alt={name} loading="lazy" /><b>{name}</b></article>)}</div><h3 className="subheading">Behan-Beti Patrons</h3><article className="family-card"><img src="/sponsors/behan-beti-family.jpg" alt="Behan-Beti sponsor family" loading="lazy" /><b>श्रीमती मफीदेवी बाबूलालजी पूनमचंदजी विनायकिया परिवार</b></article></section>
    </main>
    <footer id="footer" className="footer"><h2>Ramaniya Utsav 2026 Committee</h2><p>Organizer: Shri Jain Sangh, Ramaniya</p><h3>CONTACT FOR HELP</h3><div className="contact-row"><a href="tel:+919426217214">☎ मदन दांतावाडिया<br /><strong>+91 94262 17214</strong></a><a href="tel:+919841050752">☎ हितेंद्र मुनोत<br /><strong>+91 98410 50752</strong></a></div><div className="committee-grid">{committee.map(([role, name]) => <div key={role}><b>{role}</b><span>{name}</span></div>)}</div><p className="copyright">© 2026 Ramaniya Utsav · Shri Jain Sangh, Ramaniya</p></footer></>;
}
