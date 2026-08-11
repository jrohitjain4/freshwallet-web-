import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
};

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export function useRazorpay() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  const openCheckout = useCallback(
    (options: Omit<RazorpayOptions, 'handler'> & {
      onSuccess: RazorpayOptions['handler'];
      onDismiss?: () => void;
    }) => {
      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is not loaded');
      }
      const { onSuccess, onDismiss, ...rest } = options;
      const rzp = new window.Razorpay({
        ...rest,
        handler: onSuccess,
        modal: { ondismiss: onDismiss },
      });
      rzp.open();
    },
    []
  );

  return { ready, openCheckout };
}

export function getRazorpayKeyId() {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || '';
}
