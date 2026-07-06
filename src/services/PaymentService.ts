export interface CheckoutDTO {
  amount: number;
  description?: string;
  items?: unknown[];
  payment_method?: string;
}

export interface CheckoutResult {
  checkout_url: string | null;
  order_created: boolean;
  error?: string;
}

export class PaymentService {
  async createCheckoutSession(data: CheckoutDTO): Promise<CheckoutResult> {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return {
        checkout_url: null,
        order_created: true,
        error: "Payment gateway not configured",
      };
    }

    const amount = Math.round(data.amount * 100);

    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount,
            currency: "PHP",
            description: data.description || "Coffee Shop Order",
            statement_descriptor: "BREW & CO.",
          },
        },
      }),
    });

    if (!response.ok) {
      return {
        checkout_url: null,
        order_created: true,
        error: "Payment gateway error",
      };
    }

    const result = await response.json();
    const checkoutUrl = result?.data?.attributes?.checkout_url;

    return { checkout_url: checkoutUrl, order_created: true };
  }
}
