import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Squeaky Clean Thailand. How we protect your home, belongings, and personal data.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: 12 June 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-foreground/80 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
        <p>
          Squeaky Clean (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
          privacy — both in your home and online. This Privacy Policy explains how we safeguard
          your property, personal belongings, and personal data when you use our cleaning services
          or visit our website at squeakycleansamui.com. This policy is designed to comply with the
          Thailand Personal Data Protection Act (PDPA) B.E. 2562 (2019).
        </p>

        <h2>1. Your Home &amp; In-Person Privacy</h2>
        <p>
          When our team enters your property, we take your in-home privacy extremely seriously.
          The following commitments apply to every clean:
        </p>

        <h3>Property access &amp; key handling</h3>
        <ul>
          <li>Keys, access codes, and lock-box combinations are stored securely and encrypted. They are only shared with the assigned cleaning team member for that specific booking.</li>
          <li>Access credentials are never copied, photographed, or shared with unauthorised parties.</li>
          <li>If you change your locks or access codes, please update us before your next booking.</li>
          <li>Upon termination of service, all access credentials are permanently deleted from our systems within 7 days.</li>
        </ul>

        <h3>Personal belongings</h3>
        <ul>
          <li>Our cleaners are trained to clean around personal items without opening, reading, or disturbing private documents, devices, or personal belongings.</li>
          <li>Drawers, cabinets, safes, and closed storage are never opened unless you specifically request it as part of the clean.</li>
          <li>If a personal item is found out of place (e.g., left on a floor or countertop), it will be placed in a visible, safe location — never removed from the property.</li>
          <li>Lost or misplaced items discovered during cleaning are reported to you immediately.</li>
        </ul>

        <h3>Photography &amp; recording</h3>
        <ul>
          <li>Before/after photos are taken only of cleaned areas for quality assurance purposes and only when you have opted into photo reports.</li>
          <li>Photos never intentionally capture personal items, documents, screens, or anything identifiable beyond the cleaned space.</li>
          <li>Photo reports are shared only with you (the account holder) and are deleted from our systems after 90 days.</li>
          <li>Our team members are strictly prohibited from taking personal photos or recordings inside your property.</li>
        </ul>

        <h3>Security cameras &amp; monitoring</h3>
        <ul>
          <li>If you have security cameras or monitoring systems in your property, please inform us at the time of booking.</li>
          <li>We respect your right to monitor your property. Our team is aware that they may be recorded during service.</li>
          <li>We ask that cameras in private areas (bathrooms, bedrooms) be disclosed and, where possible, disabled during cleaning for the comfort and dignity of our team.</li>
        </ul>

        <h3>Confidentiality</h3>
        <ul>
          <li>All cleaning team members sign confidentiality agreements as a condition of employment.</li>
          <li>Information about your property, lifestyle, routines, or household is never discussed with other clients or outside parties.</li>
          <li>Our team will not disclose whether a property is occupied, vacant, or being rented — this includes to neighbours, building management, or anyone who asks.</li>
        </ul>

        <h3>Vetting &amp; trust</h3>
        <ul>
          <li>All cleaning team members undergo background checks and reference verification before being assigned to any property.</li>
          <li>Team members carry company identification at all times during service.</li>
          <li>You will always be notified in advance of who will be attending your property, including any changes to your regular cleaner.</li>
        </ul>

        <h2>2. Information We Collect Online</h2>

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
          <li><strong>Cookies:</strong> Session cookies for site functionality and analytics cookies to understand usage patterns (see Section 7).</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li><strong>Service delivery:</strong> To schedule, confirm, and carry out cleaning services you have booked.</li>
          <li><strong>Communication:</strong> To send booking confirmations, reminders, service updates, and respond to your inquiries.</li>
          <li><strong>Payment processing:</strong> To process payments and issue receipts.</li>
          <li><strong>Quality assurance:</strong> To manage photo reports, checklists, and follow up on satisfaction.</li>
          <li><strong>Service improvement:</strong> To analyse usage patterns and improve our website and services.</li>
          <li><strong>Marketing:</strong> To send promotional offers and updates, only with your explicit consent. You may opt out at any time.</li>
          <li><strong>Legal compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
        </ul>

        <h2>4. Legal Basis for Processing (PDPA)</h2>
        <p>Under the Thailand PDPA, we process your personal data based on:</p>
        <ul>
          <li><strong>Contractual necessity:</strong> Processing required to fulfil our cleaning service agreement with you.</li>
          <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications, photo reports).</li>
          <li><strong>Legitimate interest:</strong> For purposes such as improving our services, fraud prevention, and business operations, where such interests are not overridden by your rights.</li>
          <li><strong>Legal obligation:</strong> Where processing is required by Thai law (e.g., tax and accounting records).</li>
        </ul>

        <h2>5. Data Sharing &amp; Disclosure</h2>
        <p>We do not sell your personal data. We may share your information with:</p>
        <ul>
          <li><strong>Assigned cleaning team:</strong> Only the property address and access details necessary to perform the booked service. Team members do not receive your full personal profile.</li>
          <li><strong>Payment processors:</strong> Secure payment providers who process transactions on our behalf.</li>
          <li><strong>Technology providers:</strong> Hosting, database, and email service providers who help us operate the Service, all bound by data processing agreements.</li>
          <li><strong>Legal authorities:</strong> When required by law, court order, or governmental regulation.</li>
        </ul>

        <h2>6. Data Retention</h2>
        <ul>
          <li><strong>Active accounts:</strong> We retain your personal data for as long as your account is active or as needed to provide services.</li>
          <li><strong>Property access credentials:</strong> Deleted within 7 days of service termination or upon your request.</li>
          <li><strong>Photo reports:</strong> Deleted after 90 days unless you request earlier deletion.</li>
          <li><strong>Booking records:</strong> Retained for 3 years after service completion for quality assurance and legal purposes.</li>
          <li><strong>Payment records:</strong> Retained for 5 years as required by Thai tax and accounting regulations.</li>
          <li><strong>Marketing data:</strong> Until you withdraw consent or unsubscribe.</li>
          <li>After the retention period, data is securely deleted or anonymised.</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>Our website uses cookies for:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the website to function (session management, authentication). These cannot be disabled.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use the website. These are only set with your consent.</li>
        </ul>
        <p>
          You can manage cookie preferences through your browser settings. Disabling essential
          cookies may affect website functionality.
        </p>

        <h2>8. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal
          data, including:
        </p>
        <ul>
          <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
          <li>Secure, encrypted storage of property access credentials.</li>
          <li>Access controls limiting data access to authorised personnel only.</li>
          <li>Confidentiality agreements signed by all team members.</li>
          <li>Regular security reviews of our systems and processes.</li>
        </ul>

        <h2>9. Your Rights Under the PDPA</h2>
        <p>As a data subject under Thai law, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data, including property access credentials and photo reports.</li>
          <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
          <li><strong>Data portability:</strong> Request transfer of your data in a structured, commonly used format.</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interest or for direct marketing purposes.</li>
          <li><strong>Withdraw consent:</strong> Withdraw previously given consent at any time, without affecting the lawfulness of processing before withdrawal.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:squeakycleanthailand@gmail.com" className="text-accent hover:underline">
            squeakycleanthailand@gmail.com
          </a>. We will respond within 30 days.
        </p>

        <h2>10. International Data Transfers</h2>
        <p>
          Some of our service providers (hosting, database, email) may store or process data
          outside of Thailand. Where this occurs, we ensure appropriate safeguards are in place
          in accordance with PDPA requirements, including data processing agreements with
          adequate protection measures.
        </p>

        <h2>11. Minors</h2>
        <p>
          Our cleaning services are contracted with adults (property owners, tenants, or
          their authorised representatives). We do not knowingly collect personal data from
          anyone under 20 years of age (the age of majority in Thailand). If a minor&apos;s
          information has been submitted to us inadvertently, please contact us and we will
          delete it promptly.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated &quot;Last updated&quot; date. For significant changes that affect how we
          handle your property access or in-home privacy, we will notify you directly via email.
          Continued use of the Service after changes constitutes acceptance of the revised policy.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about this Privacy Policy, concerns about in-home privacy, or to exercise
          your data rights:
        </p>
        <ul>
          <li><strong>Email:</strong>{' '}
            <a href="mailto:squeakycleanthailand@gmail.com" className="text-accent hover:underline">
              squeakycleanthailand@gmail.com
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
