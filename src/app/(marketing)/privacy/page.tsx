import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Squeaky Clean Thailand. How we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: 12 June 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-foreground/80 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
        <p>
          Squeaky Clean (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          personal information when you visit our website at squeakycleansamui.com or use our
          cleaning services. This policy is designed to comply with the Thailand Personal Data
          Protection Act (PDPA) B.E. 2562 (2019).
        </p>

        <h2>1. Information We Collect</h2>

        <h3>Information you provide directly</h3>
        <ul>
          <li><strong>Contact details:</strong> Name, email address, phone number, LINE ID, or WhatsApp number.</li>
          <li><strong>Property information:</strong> Address, property type, number of rooms, access instructions, and special requirements.</li>
          <li><strong>Booking details:</strong> Service type, preferred dates/times, recurring plan preferences.</li>
          <li><strong>Payment information:</strong> Bank transfer details, credit/debit card information (processed securely through our payment provider), PromptPay details.</li>
          <li><strong>Communication records:</strong> Messages, emails, and feedback you send to us.</li>
          <li><strong>Account information:</strong> Email and authentication details if you create an account.</li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Device &amp; browser data:</strong> IP address, browser type, operating system, device type.</li>
          <li><strong>Usage data:</strong> Pages visited, time spent on pages, referring website, click patterns.</li>
          <li><strong>Cookies &amp; similar technologies:</strong> Session cookies for site functionality and analytics cookies to understand usage patterns (see Section 6).</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your personal data for the following purposes:</p>
        <ul>
          <li><strong>Service delivery:</strong> To schedule, confirm, and carry out cleaning services you have booked.</li>
          <li><strong>Communication:</strong> To send booking confirmations, reminders, service updates, and respond to your inquiries.</li>
          <li><strong>Payment processing:</strong> To process payments and issue receipts for services rendered.</li>
          <li><strong>Service improvement:</strong> To analyse usage patterns and improve our website and services.</li>
          <li><strong>Quality assurance:</strong> To manage photo reports, checklists, and follow up on satisfaction.</li>
          <li><strong>Marketing:</strong> To send promotional offers and updates, only with your explicit consent. You may opt out at any time.</li>
          <li><strong>Legal compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
        </ul>

        <h2>3. Legal Basis for Processing (PDPA)</h2>
        <p>Under the Thailand PDPA, we process your personal data based on:</p>
        <ul>
          <li><strong>Contractual necessity:</strong> Processing required to fulfil our cleaning service agreement with you.</li>
          <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications).</li>
          <li><strong>Legitimate interest:</strong> For purposes such as improving our services, fraud prevention, and business operations, where such interests are not overridden by your rights.</li>
          <li><strong>Legal obligation:</strong> Where processing is required by Thai law (e.g., tax and accounting records).</li>
        </ul>

        <h2>4. Data Sharing &amp; Disclosure</h2>
        <p>We do not sell your personal data. We may share your information with:</p>
        <ul>
          <li><strong>Cleaning team members:</strong> Property address and access details necessary to perform the booked service.</li>
          <li><strong>Payment processors:</strong> Secure payment providers who process transactions on our behalf.</li>
          <li><strong>Technology providers:</strong> Hosting (Netlify), database (Supabase), and email service providers who help us operate the Service, all bound by data processing agreements.</li>
          <li><strong>Legal authorities:</strong> When required by law, court order, or governmental regulation.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <ul>
          <li><strong>Active accounts:</strong> We retain your personal data for as long as your account is active or as needed to provide services.</li>
          <li><strong>Booking records:</strong> Retained for 3 years after service completion for quality assurance and legal purposes.</li>
          <li><strong>Payment records:</strong> Retained for 5 years as required by Thai tax and accounting regulations.</li>
          <li><strong>Marketing data:</strong> Until you withdraw consent or unsubscribe.</li>
          <li>After the retention period, data is securely deleted or anonymised.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>Our website uses cookies for:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the website to function (session management, authentication). These cannot be disabled.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use the website. These are only set with your consent.</li>
        </ul>
        <p>
          You can manage cookie preferences through your browser settings. Disabling essential
          cookies may affect website functionality.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal
          data, including:
        </p>
        <ul>
          <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
          <li>Secure authentication with encrypted password storage.</li>
          <li>Access controls limiting data access to authorised personnel only.</li>
          <li>Regular security reviews of our systems and processes.</li>
        </ul>
        <p>
          While we take reasonable steps to protect your data, no method of transmission over the
          internet or electronic storage is 100% secure.
        </p>

        <h2>8. Your Rights Under the PDPA</h2>
        <p>As a data subject under Thai law, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data where there is no lawful reason for continued processing.</li>
          <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
          <li><strong>Data portability:</strong> Request transfer of your data in a structured, commonly used format.</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interest or for direct marketing purposes.</li>
          <li><strong>Withdraw consent:</strong> Withdraw previously given consent at any time, without affecting the lawfulness of processing before withdrawal.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:squakycleanthailand@gmail.com" className="text-accent hover:underline">
            squakycleanthailand@gmail.com
          </a>. We will respond within 30 days.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Some of our service providers (hosting, database, email) may store or process data
          outside of Thailand. Where this occurs, we ensure appropriate safeguards are in place
          in accordance with PDPA requirements, including data processing agreements with
          adequate protection measures.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          Our Service is not directed to individuals under 20 years of age (the age of majority
          in Thailand). We do not knowingly collect personal data from minors. If you believe we
          have inadvertently collected data from a minor, please contact us immediately.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated &quot;Last updated&quot; date. We encourage you to review this policy
          periodically. Continued use of the Service after changes constitutes acceptance of the
          revised policy.
        </p>

        <h2>12. Contact &amp; Data Protection Officer</h2>
        <p>
          For questions about this Privacy Policy or to exercise your data rights, contact us:
        </p>
        <ul>
          <li><strong>Email:</strong>{' '}
            <a href="mailto:squakycleanthailand@gmail.com" className="text-accent hover:underline">
              squakycleanthailand@gmail.com
            </a>
          </li>
          <li><strong>Website:</strong>{' '}
            <a href="https://squeakycleansamui.com/contact" className="text-accent hover:underline">
              squeakycleansamui.com/contact
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
