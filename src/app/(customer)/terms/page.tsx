import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the InstantNeed platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: 9 July 2026</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-3 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p+ul]:mt-3">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the InstantNeed
          website (instantneed.in) and mobile application (together, the &quot;Platform&quot;), operated
          by Instantneed Pvt Ltd, having its registered office at 5959, 12 Cross Road, Ambala Cantt,
          Ambala 133001, Haryana, India (&quot;InstantNeed,&quot; &quot;we,&quot; &quot;us&quot;). By
          creating an account or placing an order, you agree to these Terms.
        </p>

        <section>
          <h2>1. Who Can Use InstantNeed</h2>
          <p>
            InstantNeed is a B2B wholesale ordering platform intended for businesses, shop-owners, and
            other commercial buyers purchasing goods for resale or business use — not for individual
            personal/household consumption. You must provide accurate registration information,
            including a valid business name and GST/VAT number where applicable, and you are responsible
            for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section>
          <h2>2. Orders and Pricing</h2>
          <ul>
            <li>
              Product listings show pricing, applicable volume/tier discounts, and minimum order
              quantities (MOQ) at the time of browsing. Prices are subject to change without notice until
              an order is confirmed.
            </li>
            <li>
              Placing an order constitutes an offer to purchase, which we may accept or decline (e.g.,
              due to stock unavailability or pincode serviceability restrictions).
            </li>
            <li>
              <strong>Payment</strong>: InstantNeed currently operates on a Cash on Delivery (COD) basis
              only. No online payment, card, or UPI details are collected or processed by the Platform.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Delivery</h2>
          <p>
            We aim to deliver orders within the estimated timeframe shown at checkout, but delivery times
            are not guaranteed and may vary based on location and product availability. You are
            responsible for providing an accurate delivery address and being available (or arranging for
            someone to be available) to receive and pay for the order upon delivery.
          </p>
        </section>

        <section>
          <h2>4. Returns, Refunds &amp; Order Issues</h2>
          <p>
            If you receive damaged, incorrect, or missing items, contact us within 7 days of delivery at
            support@instantneed.in or +91 8295781959 with your order ID and a description of the issue.
            Since orders are paid via COD, approved refunds will be arranged as a replacement, store
            credit, or bank transfer, as appropriate, since no payment method is on file.
          </p>
        </section>

        <section>
          <h2>5. Account Suspension &amp; Termination</h2>
          <p>
            We may suspend or terminate your account if we reasonably believe you have violated these
            Terms, provided false registration information, or engaged in fraudulent or abusive activity.
            You may close your account at any time by contacting support.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, InstantNeed is not liable for indirect, incidental,
            or consequential damages arising from your use of the Platform. Our total liability for any
            claim relating to an order is limited to the value of that order.
          </p>
        </section>

        <section>
          <h2>7. Grievance Officer</h2>
          <p>
            In accordance with the Consumer Protection (E-Commerce) Rules, 2020, we have appointed a
            Grievance Officer:
          </p>
          <ul>
            <li><strong>Name</strong>: Raghav Aggarwal</li>
            <li><strong>Email</strong>: support@instantneed.in</li>
            <li><strong>Phone</strong>: +91 8295781959</li>
            <li>
              <strong>Address</strong>: Instantneed Pvt Ltd, 5959, 12 Cross Road, Ambala Cantt, Ambala
              133001, Haryana, India
            </li>
          </ul>
          <p>
            Complaints will be acknowledged within 48 hours and resolved within one month, in accordance
            with applicable law.
          </p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, and any disputes arising from them will be
            subject to the exclusive jurisdiction of the courts of Ambala, Haryana, India.
          </p>
        </section>

        <section>
          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Platform after changes are
            posted constitutes acceptance of the revised Terms.
          </p>
        </section>
      </div>
    </div>
  );
}
