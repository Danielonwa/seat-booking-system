import { useEffect, useRef, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { useStore } from "../store/useStore";

interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
}

export default function Payment() {
  const navigate = useNavigate();

  // Store State
  const name = useStore((s) => s.name);
  const email = useStore((s) => s.email);
  const profilePicture = useStore((s) => s.profilePicture);
  const selectedSeat = useStore((s) => s.selectedSeat);
  const paymentReference = useStore((s) => s.paymentReference);
  const confirmBooking = useStore((s) => s.confirmBooking);

  const eventName = "EventBookingPro";
  const ticketPriceNgn = 100;

  const referenceRef = useRef(`EBP-${Date.now()}`);

const config = {
  reference: referenceRef.current,
  email,
  amount: ticketPriceNgn * 100,
  publicKey: "pk_live_858dbf8453a3f29316e932e74b51f9b4e1baed85",
};


  const initializePayment = usePaystackPayment(config);

const handlePay = () => {
  initializePayment({
    onSuccess: (reference) => {

      navigate("/ticket", { replace: true });
      confirmBooking(reference.reference);
    },
    onClose: () => {
      alert("Payment closed");
    },
  });
};

  // Timer logic
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const timerText = useMemo(() => {
    const mm = Math.floor(secondsLeft / 60);
    const ss = secondsLeft % 60;
    return `${mm}:${String(ss).padStart(2, "0")}`;
  }, [secondsLeft]);

  // Guard: Ensure user has data
  if (!name || !email || !profilePicture || !selectedSeat) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p className="text-red-500 font-semibold">Missing booking info.</p>
        <Link to="/" className="text-primary font-semibold underline">Back to Selection</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-primary w-2/3"></div>
          </div>

          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Confirm Your Booking</h1>

            <div className="relative inline-block mb-6">
              {profilePicture && (
                <img
                  alt="User Profile"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover"
                  src={profilePicture}
                />
              )}
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                <span className="material-icons-outlined text-sm block">check</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Event</span>
                <span className="font-semibold text-sm">{eventName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Seat</span>
                <span className="font-bold text-primary text-lg">{selectedSeat}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₦{ticketPriceNgn.toLocaleString()}.00
                </span>
              </div>
            </div>
            
            <button onClick={handlePay}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mb-4 group"
            >
  <span className="material-icons-outlined">payment</span>
              Pay with Paystack
</button>


            <div className="bg-primary/10 rounded-lg p-4 mb-6 flex items-start gap-3 text-left">
              <span className="material-icons-outlined text-primary text-xl">timer</span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Reserved for <span className="font-bold text-primary">{timerText}</span> while you pay.
              </p>
            </div>

            <Link to="/" className="text-sm text-slate-500 hover:text-primary inline-flex items-center gap-1 font-medium">
              <span className="material-icons-outlined text-base">arrow_back</span>
              Change Seat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}