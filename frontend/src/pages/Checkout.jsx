import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Giả lập dữ liệu khóa học đang được thanh toán
  const orderItems = [
    {
      id: 1,
      title: "2024 Complete Python Bootcamp: From Zero to Hero in Python",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=200&q=80",
      price: 12.99,
      originalPrice: 84.99,
    },
  ];

  const total = orderItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Giả lập thời gian gọi API thanh toán mất 2 giây
    setTimeout(() => {
      setIsProcessing(false);
      alert("Thanh toán thành công! Chào mừng bạn đến với khóa học.");
      // TODO: Sau này sẽ gọi API /api/enrollment/checkout ở đây
      navigate("/"); // Chuyển về trang chủ hoặc trang My Learning
    }, 2000);
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* Checkout Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] px-6 lg:px-10 py-4 shadow-sm">
        <Link to="/" className="flex items-center gap-3 text-[#135bec]">
          <div className="size-8 flex items-center justify-center rounded bg-[#135bec] text-white">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            EduMarket AI
          </h2>
        </Link>
        <Link
          to="/course/1"
          className="text-sm font-semibold text-slate-500 hover:text-[#135bec] transition-colors"
        >
          Cancel Checkout
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Payment Details */}
          <div className="lg:w-3/5 space-y-8">
            {/* Billing Address */}
            <section className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Country
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-[#135bec] outline-none">
                    <option value="VN">Vietnam</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    State / Province
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ho Chi Minh"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-[#135bec] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <div className="space-y-4">
                {/* Credit Card Option */}
                <label
                  className={`block border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-[#135bec] bg-[#135bec]/5" : "border-slate-300 dark:border-slate-600 hover:border-[#135bec]/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="size-4 text-[#135bec] focus:ring-[#135bec]"
                    />
                    <span className="material-symbols-outlined text-slate-500">
                      credit_card
                    </span>
                    <span className="font-semibold">Credit / Debit Card</span>
                  </div>
                </label>

                {/* PayPal Option */}
                <label
                  className={`block border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "paypal" ? "border-[#135bec] bg-[#135bec]/5" : "border-slate-300 dark:border-slate-600 hover:border-[#135bec]/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="size-4 text-[#135bec] focus:ring-[#135bec]"
                    />
                    <span className="material-symbols-outlined text-slate-500">
                      account_balance_wallet
                    </span>
                    <span className="font-semibold">PayPal</span>
                  </div>
                </label>

                {/* VNPay / Momo Option (Demo) */}
                <label
                  className={`block border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "ewallet" ? "border-[#135bec] bg-[#135bec]/5" : "border-slate-300 dark:border-slate-600 hover:border-[#135bec]/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="ewallet"
                      checked={paymentMethod === "ewallet"}
                      onChange={() => setPaymentMethod("ewallet")}
                      className="size-4 text-[#135bec] focus:ring-[#135bec]"
                    />
                    <span className="material-symbols-outlined text-slate-500">
                      qr_code_scanner
                    </span>
                    <span className="font-semibold">Momo / VNPay</span>
                  </div>
                </label>
              </div>

              {/* Credit Card Form (Show only if card is selected) */}
              {paymentMethod === "card" && (
                <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#151e2e] space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-[#135bec] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Card Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        credit_card
                      </span>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-[#135bec] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-[#135bec] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-[#135bec] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-2/5">
            <div className="sticky top-24 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Summary</h2>

              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <img
                      src={item.image}
                      alt="Course"
                      className="w-16 h-12 object-cover rounded border border-slate-200 dark:border-slate-600"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.price}</div>
                      <div className="text-xs text-slate-500 line-through">
                        ${item.originalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Original Price:</span>
                  <span>
                    $
                    {orderItems
                      .reduce((sum, item) => sum + item.originalPrice, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Discounts:</span>
                  <span>
                    -$
                    {(
                      orderItems.reduce(
                        (sum, item) => sum + item.originalPrice,
                        0,
                      ) - total
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 mb-6 text-center">
                By completing your purchase you agree to these{" "}
                <a href="#" className="text-[#135bec] hover:underline">
                  Terms of Service
                </a>
                .
              </p>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#135bec] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Processing...
                  </>
                ) : (
                  "Complete Checkout"
                )}
              </button>

              <div className="mt-4 flex justify-center items-center gap-2 text-xs text-slate-400">
                <span className="material-symbols-outlined text-base">
                  lock
                </span>
                Secure payment powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
