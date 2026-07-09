import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How InstantNeed collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 9 July 2026</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-3 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p+ul]:mt-3">
        <p>
          InstantNeed (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the InstantNeed website
          (instantneed.in) and mobile application (together, the &quot;Platform&quot;), a B2B wholesale
          ordering platform for businesses and shop-owners in India. This Privacy Policy explains what
          personal data we collect, why we collect it, and how you can exercise your rights over it, in
          line with India&apos;s Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;).
        </p>

        <section>
          <h2>1. Data We Collect</h2>
          <p>When you register and use the Platform, we collect:</p>
          <ul>
            <li>
              <strong>Account data</strong>: name, business name, GST/VAT number, email address, phone
              number, password (stored as an irreversible cryptographic hash; we never store or have
              access to your plain-text password).
            </li>
            <li><strong>Delivery data</strong>: shipping addresses you save to your account.</li>
            <li>
              <strong>Order data</strong>: your order history, items purchased, quantities, and order
              status.
            </li>
            <li>
              <strong>Device data</strong>: if you use our mobile app, a push-notification device token,
              used solely to send you order-status updates.
            </li>
            <li>
              <strong>Usage data</strong>: IP address and basic request logs, used for security
              (rate-limiting and abuse prevention) and not for tracking or advertising.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> collect payment card, UPI, or bank account details; InstantNeed
            currently operates on a Cash on Delivery (COD) basis only, and we do not process online
            payments.
          </p>
        </section>

        <section>
          <h2>2. Why We Collect It</h2>
          <p>We process your personal data only for the following purposes:</p>
          <ul>
            <li>To create and manage your account and authenticate your login.</li>
            <li>To process, fulfil, and deliver your orders, including generating invoices.</li>
            <li>
              To send you order confirmations, delivery updates, and account-related notifications
              (email and/or push notification).
            </li>
            <li>To respond to support requests sent to our customer care contacts.</li>
            <li>To detect and prevent fraud, abuse, and unauthorized access.</li>
          </ul>
          <p>
            We do not sell your personal data to third parties, and we do not use your data for targeted
            advertising.
          </p>
        </section>

        <section>
          <h2>3. Where Your Data Is Stored</h2>
          <p>
            Your data is stored on servers operated by Amazon Web Services (AWS), which may be located
            outside India. We take reasonable technical and organizational measures (encrypted database
            connections, hashed passwords, access controls) to protect your data regardless of where it
            is processed.
          </p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>Under the DPDP Act, you have the right to:</p>
          <ul>
            <li>Access a summary of the personal data we hold about you.</li>
            <li>Request correction or erasure of your personal data.</li>
            <li>
              Withdraw consent for processing (note: withdrawing consent for core account data may mean
              we can no longer provide you the Platform&apos;s services).
            </li>
            <li>
              File a grievance with us (see Section 6), and if unresolved, escalate to the Data
              Protection Board of India.
            </li>
          </ul>
          <p>To exercise any of these rights, contact us using the details in Section 6.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your account and order data for as long as your account is active, and for a
            reasonable period afterward as required for tax, accounting, and legal compliance purposes.
            You may request deletion of your account at any time, subject to these retention obligations.
          </p>
        </section>

        <section>
          <h2>6. Grievance Officer / Contact Us</h2>
          <p>
            If you have questions or complaints about this Privacy Policy or how your data is handled,
            contact:
          </p>
          <ul>
            <li><strong>Grievance Officer</strong>: Raghav Aggarwal</li>
            <li><strong>Email</strong>: support@instantneed.in</li>
            <li><strong>Phone</strong>: +91 8295781959</li>
            <li>
              <strong>Address</strong>: Instantneed Pvt Ltd, 5959, 12 Cross Road, Ambala Cantt, Ambala
              133001, Haryana, India
            </li>
          </ul>
          <p>We will acknowledge your complaint within 48 hours and aim to resolve it within 30 days.</p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected by
            updating the &quot;Last updated&quot; date above. Continued use of the Platform after changes
            constitutes acceptance of the revised policy.
          </p>
        </section>
      </div>
    </div>
  );
}
