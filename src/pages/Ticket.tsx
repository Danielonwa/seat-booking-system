import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useStore } from "../store/useStore";



export default function Ticket() {


  const navigate = useNavigate();

  const name = useStore((s) => s.name);
  const email = useStore((s) => s.email);
  const profilePicture = useStore((s) => s.profilePicture);
  const selectedSeat = useStore((s) => s.selectedSeat);
  const paymentReference = useStore((s) => s.paymentReference);

  const eventName = "MY HIGHS & I";
  const supportEmail = "itsdavid4life@gmail.com";

  const previewUrl = profilePicture;

  const ticketId = useMemo(() => {
    if (!paymentReference) return "";
    const last4 = paymentReference.slice(-4); // Use last 4 digits of Paystack ref
    return `#EBP-${last4}`;
  }, [paymentReference]);

  const waitForImages = async (root: HTMLElement) => {
    const imgs = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  };
  useEffect(() => {
  if (!paymentReference) {
    navigate("/", { replace: true });
  }
}, [paymentReference, navigate]);


  const downloadPNG = async () => {
    const element = document.getElementById("ticket-card");
    if (!element) return;
    await waitForImages(element);
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `ticket-${selectedSeat}.png`;
    link.click();
  };

  const downloadPDF = async () => {
    const element = document.getElementById("ticket-card");
    if (!element) return;
    await waitForImages(element);
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`ticket-${selectedSeat}.pdf`);
  };

  if (!name || !email || !profilePicture || !selectedSeat || !paymentReference) {
    return <p className="p-6">Incomplete booking info. Access denied.</p>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-6">
      <style>{`
        .ticket-dashed-line { background-image: linear-gradient(to right, #e2e8f0 50%, transparent 50%); background-size: 10px 1px; background-repeat: repeat-x; }
        .ticket-cutout-left, .ticket-cutout-right { position: absolute; width: 20px; height: 20px; background-color: #f6f7f8; border-radius: 50%; top: 50%; transform: translateY(-50%); }
        .ticket-cutout-left { left: -10px; }
        .ticket-cutout-right { right: -10px; }
        .dark .ticket-cutout-left, .dark .ticket-cutout-right { background-color: #101922; }
      `}</style>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mb-4">
          <span className="material-icons">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Booking Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your digital ticket is ready.</p>
      </div>

      <div id="ticket-card" className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-8 pb-6 bg-primary/5 dark:bg-primary/10 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-primary font-semibold text-xs uppercase tracking-wider">Event Pass</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 leading-tight">{eventName}</h2>
            </div>
            <div className="ml-4 shrink-0">
              {previewUrl && <img alt="Attendee" className="w-16 h-16 rounded-lg object-cover border-2 border-white dark:border-slate-700 shadow-sm" src={previewUrl} />}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <span className="material-icons text-primary mr-2 text-sm">calendar_today</span>
              <span className="text-sm">28TH FEB • 10:00 AM</span>
            </div>
          </div>
        </div>

        <div className="p-8 py-6 relative">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Attendee Name</label>
              <p className="text-slate-800 dark:text-white font-semibold">{name}</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Seat Number</label>
              <p className="text-primary font-bold text-lg">{selectedSeat}</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Ticket ID</label>
              <p className="text-slate-800 dark:text-white font-semibold">{ticketId}</p>
            </div>
          </div>
        </div>

        <div className="relative h-5">
          <div className="ticket-cutout-left"></div>
          <div className="ticket-cutout-right"></div>
          <div className="absolute inset-0 flex items-center px-6">
            <div className="w-full ticket-dashed-line h-[1px]"></div>
          </div>
        </div>

        <div className="p-8 pt-6 pb-10 flex flex-col items-center">
          <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm mb-4">
            <div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded">
              <span className="material-icons text-slate-400">qr_code_2</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Scan at entrance</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-[420px] flex flex-col gap-3">
        <button onClick={() => navigate("/")} className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2">
          <span className="material-icons text-sm">add_circle_outline</span>
          Book Another Seat
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={downloadPNG} className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium">
            <span className="material-icons text-sm">image</span> PNG
          </button>
          <button onClick={downloadPDF} className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium">
            <span className="material-icons text-sm">picture_as_pdf</span> PDF
          </button>
        </div>
      </div>
      {/* Footer Help */}
      <div className="mt-12 text-center pb-8">
        <p className="text-slate-400 text-sm">
          Need help? Contact our support at{" "}
          <span className="text-primary hover:underline font-medium">{supportEmail}</span>
        </p>
      </div>
    </div>
  );
}