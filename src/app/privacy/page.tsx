import Header from "../components/header";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black font-sans text-white [&_h2]:text-neutral-200 [&_h3]:text-neutral-200 [&_li]:text-neutral-300 [&_p]:text-neutral-300">
      <div className="mx-auto max-w-[100rem] p-4 md:px-6 md:pt-6 md:pb-2">
        <Header />
        <div className="container mx-auto max-w-3xl px-4">
          <div className="font-sans text-neutral-800 antialiased">
            <div className="mx-auto py-4">
              <h1 className="pb-6 text-center text-2xl font-extrabold text-neutral-100 sm:text-3xl">
                HopperClip Privacy Policy
              </h1>
              <p className="mb-8 text-center text-sm text-neutral-400">
                Effective Date: June 30, 2025
              </p>
              <p className="mb-6 leading-relaxed">
                This Privacy Policy describes how Hopper Clip (&quot;Hopper
                Clip&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                collects, uses, and shares your personal information when you
                use our web application (the &quot;Service&quot;). We care
                deeply about your privacy. Hopper Clip is built with privacy in
                mind, and as an open-source project, you even have the option to
                host your own version of Hopper Clip. The GitHub repository for
                this project is available{" "}
                <a
                  className="underline"
                  href="https://github.com/tsoumdoa/better-gh-lib"
                >
                  here
                </a>
                .
              </p>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                1. Who We Are
              </h2>
              <p className="mb-6 leading-relaxed">
                Hopper Clip is a solo indie open-source project developed and
                maintained by Tomo Suda. Our mission is to provide a useful tool
                while respecting your privacy.
              </p>
              <h2 className="mb-4 text-3xl font-bold">
                2. Information We Collect
              </h2>
              <p className="mb-2 leading-relaxed">
                We collect information to provide and improve our Service.
              </p>
              <h3 className="mb-3 text-2xl font-semibold">
                a. Information You Provide to Us:
              </h3>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">
                    Account Information:
                  </strong>{" "}
                  When you create an account on Hopper Clip, we collect personal
                  data provided by our authentication provider, Clerk. This
                  includes information such as your email address and a unique
                  user ID.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    Third-Party Authentication Data:
                  </strong>
                  If you choose to log in using a third-party service like
                  Google or GitHub via Clerk, we receive only the necessary
                  information for authentication, such as your user ID and email
                  address. We do not access or store any other personal data
                  from your Google or GitHub accounts beyond what is strictly
                  required to verify your identity and create your Hopper Clip
                  account.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    Hopper Clip Content:
                  </strong>{" "}
                  The core functionality of Hopper Clip involves you creating
                  and managing "snippets" of scripts. This content, including
                  the script text and any associated metadata, is stored by us
                  as part of the Service.
                </li>
              </ul>
              <h3 className="mb-3 text-2xl font-semibold text-neutral-800">
                b. Information We Collect Automatically:
              </h3>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">Usage Data:</strong> We
                  collect information about how you interact with the Service,
                  such as the actions you take on the site (e.g., creating a
                  snippet, viewing a snippet, using specific features). This
                  helps us understand how the app is used and allows us to
                  improve it.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Device Information:</strong>{" "}
                  We may collect information about the device you use to access
                  Hopper Clip, including your IP address, browser type,
                  operating system, and unique device identifiers.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Log Data:</strong> Like most
                  websites, our servers automatically record information that
                  your browser sends whenever you visit the Service. This "Log
                  Data" may include your IP address, browser type and settings,
                  the date and time of your request, and how you interacted with
                  our Service.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    Cookies and Tracking Technologies:
                  </strong>
                  We use cookies primarily for authentication purposes, to keep
                  you logged in and ensure the secure operation of your account.
                  We also use cookies for basic web analytics (via PostHog) to
                  understand general usage patterns of the Service. We do not
                  use cookies for tracking purposes across other websites or for
                  targeted advertising.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                3. How We Use Your Information
              </h2>
              <p className="mb-2 leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">
                    To Provide and Maintain the Service:
                  </strong>
                  This includes allowing you to log in, create, store, and
                  manage your script snippets, and ensuring the core
                  functionality of Hopper Clip operates correctly.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    To Authenticate Users:
                  </strong>{" "}
                  We use the information from Clerk and your chosen third-party
                  login (Google/GitHub) solely to verify your identity and
                  secure your account.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    To Understand and Improve Our Service:
                  </strong>
                  We analyze usage data and web analytics (via PostHog) to
                  understand how users interact with Hopper Clip, identify areas
                  for improvement, and develop new features.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    For Security Purposes:
                  </strong>{" "}
                  To protect the integrity and security of the Service and our
                  users, including preventing fraud and unauthorized access.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    To Comply with Legal Obligations:
                  </strong>
                  To meet any applicable laws, regulations, or legal processes.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                4. How We Store Your Information
              </h2>
              <p className="mb-2 leading-relaxed">
                We are committed to securing your data.
              </p>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">Metadata Storage:</strong>{" "}
                  Metadata associated with each snippet of script you create is
                  saved in LibSQL, hosted by Turso.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    Snippet Content Storage:
                  </strong>{" "}
                  The actual script content (snippets) is stored in R2 blob
                  storage, hosted by Cloudflare.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">
                    Access to Your Data:
                  </strong>{" "}
                  Your data, including your script snippets and associated
                  metadata, is primarily accessible only to you as the
                  authenticated user. As site administrators, we also have
                  access to this data for the purpose of operating, maintaining,
                  and supporting the Service. We implement reasonable security
                  measures to protect your data.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                5. How We Share Your Information
              </h2>
              <p className="mb-2 leading-relaxed">
                We do not share your personal information with anyone. The only
                exceptions are:
              </p>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">Service Providers:</strong>{" "}
                  We use third-party service providers (Clerk for
                  authentication, Turso for database hosting, Cloudflare R2 for
                  blob storage, and PostHog for analytics) to help us operate
                  and provide the Service. These providers is contractually
                  obligated to protect your information and only use it for the
                  purposes of providing their services to us.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Legal Compliance:</strong>{" "}
                  We may disclose your information if required to do so by law
                  or in response to valid requests by public authorities (e.g.,
                  a court order or government agency).
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Business Transfers:</strong>{" "}
                  In the event that Hopper Clip is involved in a merger,
                  acquisition, or asset sale, your personal information may be
                  transferred as part of that transaction. We will notify you
                  before your personal information is transferred and becomes
                  subject to a different privacy policy.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                6. Data Retention and Deletion
              </h2>
              <p className="mb-2 leading-relaxed">
                We believe in minimal data retention.
              </p>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">Account Deletion:</strong>{" "}
                  When you delete your Hopper Clip account, we destroy all your
                  associated data, including your account information, script
                  snippets, and any associated metadata. We do not retain your
                  data after account deletion.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                7. Children's Privacy
              </h2>
              <p className="mb-6 leading-relaxed">
                Hopper Clip is not intended for use by children under the age of
                13. We do not knowingly collect
              </p>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                8. Your Privacy Choices and Rights
              </h2>
              <p className="mb-2 leading-relaxed">
                You have certain rights regarding your personal information:
              </p>
              <ul className="mb-6 list-disc pl-5 leading-relaxed">
                <li className="mb-2">
                  <strong className="font-semibold">Access and Update:</strong>{" "}
                  You can access and update most of your account information
                  through your Hopper Clip account settings.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Account Deletion:</strong>{" "}
                  You have the right to delete your Hopper Clip account at any
                  time. Instructions for account deletion are available within
                  the application or by contacting us. As stated above, upon
                  account deletion, all your data will be destroyed.
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Cookie Preferences:</strong>{" "}
                  You can typically set your browser to refuse all or some
                  browser cookies, or to alert you when cookies are being sent.
                  If you disable or refuse cookies, please note that some parts
                  of the Service may then be inaccessible or not function
                  properly.
                </li>
              </ul>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                9. Changes to This Privacy Policy
              </h2>
              <p className="mb-6 leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by sending an email to the email
                address associated with your account. The &quot;Effective
                Date&quot; at the top of this Privacy Policy will also be
                updated. We encourage you to review this Privacy Policy
                periodically for any changes.
              </p>
              <h2 className="mb-4 text-3xl font-bold text-neutral-300">
                10. Contact Us
              </h2>
              <p className="mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:{" "}
                <a
                  className="font-bold text-neutral-100"
                  href="mailto:your_email@example.com"
                >
                  privacy@hopperclip.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
