import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Squeaky Clean Thailand cleaning services.',
}

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted mb-10">Last updated: 12 June 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-foreground/80 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
        <p>
          Welcome to Squeaky Clean (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms of Service
          (&quot;Terms&quot;) govern your use of our website at squeakycleansamui.com and any related services
          (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by
          these Terms.
        </p>

        <h2>1. Services</h2>
        <p>
          Squeaky Clean provides professional cleaning services for residential and commercial
          properties across Thailand, including but not limited to regular cleaning, deep cleaning,
          villa cleaning, Airbnb turnover cleaning, and office cleaning.
        </p>

        <h2>2. Booking &amp; Scheduling</h2>
        <ul>
          <li>All bookings are made through our website or by contacting us directly via email or messaging.</li>
          <li>Bookings are subject to availability and confirmation by our team.</li>
          <li>You agree to provide accurate property details, access instructions, and contact information when making a booking.</li>
          <li>We reserve the right to decline or cancel bookings at our discretion.</li>
        </ul>

        <h2>3. Pricing &amp; Payment</h2>
        <ul>
          <li>Prices are quoted in Thai Baht (THB) and are based on property size, service type, and any additional requirements.</li>
          <li>Final pricing is confirmed at the time of booking and may vary from estimates shown on the website.</li>
          <li>Payment is due upon completion of service unless otherwise agreed in writing.</li>
          <li>We accept bank transfer, credit/debit card, and PromptPay.</li>
          <li>Recurring plan discounts (weekly, fortnightly, monthly) apply only to active, ongoing subscriptions and may be modified with 14 days&apos; notice.</li>
        </ul>

        <h2>4. Cancellation &amp; Rescheduling</h2>
        <ul>
          <li><strong>Free cancellation or rescheduling:</strong> Up to 24 hours before the scheduled service time.</li>
          <li><strong>Late cancellation (less than 24 hours):</strong> A cancellation fee of 50% of the quoted service price may apply.</li>
          <li><strong>No-show:</strong> If our team cannot access the property at the scheduled time and no prior notice was given, the full service fee may be charged.</li>
          <li>We reserve the right to cancel or reschedule due to unforeseen circumstances (severe weather, emergencies, etc.) with no charge to you.</li>
        </ul>

        <h2>5. Access &amp; Property</h2>
        <ul>
          <li>You are responsible for providing safe and reasonable access to the property at the scheduled time.</li>
          <li>We are not responsible for any pre-existing damage to your property. We recommend noting any existing damage before our team arrives.</li>
          <li>If our team identifies any hazardous conditions (structural issues, pest infestations, biohazards), we reserve the right to decline or stop the service.</li>
        </ul>

        <h2>6. Quality &amp; Satisfaction</h2>
        <ul>
          <li>We strive for 100% customer satisfaction. If you are not satisfied with the quality of our service, please contact us within 24 hours of service completion.</li>
          <li>We will arrange a complimentary re-clean of the specific areas of concern at no additional cost.</li>
          <li>Refund requests are assessed on a case-by-case basis.</li>
        </ul>

        <h2>7. Liability</h2>
        <ul>
          <li>While we take every care when cleaning your property, our total liability for any damage caused directly by our team during a cleaning session is limited to the value of the service fee paid for that session.</li>
          <li>We are not liable for damage to items that are fragile, improperly secured, or not disclosed prior to cleaning.</li>
          <li>Claims for damage must be reported within 48 hours of the service, accompanied by photographs and a description of the damage.</li>
          <li>We are not liable for any indirect, incidental, or consequential damages.</li>
        </ul>

        <h2>8. Your Responsibilities</h2>
        <ul>
          <li>Secure valuables, important documents, and cash before our team arrives.</li>
          <li>Inform us of any alarm codes, parking instructions, or pet-related considerations.</li>
          <li>Ensure the property is in a safe and accessible condition for our team.</li>
        </ul>

        <h2>9. Recurring Cleaning Plans</h2>
        <ul>
          <li>Recurring plans (weekly, fortnightly, monthly) are ongoing agreements that can be paused or cancelled with 7 days&apos; written notice.</li>
          <li>Discounts apply only while the plan is active. Missed sessions without proper notice may be charged at the standard rate.</li>
          <li>We reserve the right to adjust recurring plan pricing with 14 days&apos; notice.</li>
        </ul>

        <h2>10. Intellectual Property</h2>
        <p>
          All content on the Service, including text, graphics, logos, and images, is the property
          of Squeaky Clean and is protected by applicable intellectual property laws. You may not
          reproduce, distribute, or create derivative works from our content without written permission.
        </p>

        <h2>11. Privacy</h2>
        <p>
          Your use of the Service is also governed by our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>,
          which describes how we collect, use, and protect your personal information.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the Kingdom of
          Thailand. Any disputes arising from these Terms shall be subject to the exclusive
          jurisdiction of the courts of Thailand.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Changes will be posted on this page with an
          updated &quot;Last updated&quot; date. Continued use of the Service after changes constitutes
          acceptance of the revised Terms.
        </p>

        <h2>14. Contact</h2>
        <p>
          If you have questions about these Terms, please contact us at{' '}
          <a href="mailto:squakycleanthailand@gmail.com" className="text-accent hover:underline">
            squakycleanthailand@gmail.com
          </a>.
        </p>
      </div>
    </main>
  )
}
