import { Link } from "react-router";
import PageMeta from "@/components/_archives/common/PageMeta";

export default function PrivacyNotice() {
  return (
    <>
      <PageMeta title="Privacy Notice" />

      <div className="h-full w-full">
        <div className="max-w-3xl mx-auto flex flex-col gap-y-5 pt-8">
          <Link to="/" className="block mb-4">
            <img
              width={300}
              height={72}
              src="/images/curakidney-logo-transparent.png"
              alt="Logo"
              className="mx-auto"
            />
          </Link>
          <h1 className="text-3xl text-center font-bold">Privacy Notice</h1>

          <div className="px-4 py-8 space-y-4 text-gray-800">
            <p className="text-2xl font-bold">Privacy Notice</p>
            <p>
              We at CuraKidney value your privacy as much as we value you as
              users of our system. To safeguard your information, we comply with
              the Republic Act No. 10173 otherwise known as the Philippine Data
              Privacy Act of 2012.
            </p>
            <p>
              We are to update this Privacy Notice as needed to ensure that we
              are compliant with regulatory requirements.
            </p>

            <p className="text-xl font-semibold mt-6">Company Background</p>
            <p>
              CuraKidney is a Health Information Technology Provider (HITP) for
              medical centers, dialysis units, clinics, doctors, nurses,
              healthcare staff and patients. We may collect, process, and share
              your information so that our system and our service will be up to
              date and available.
            </p>

            <p className="text-xl font-semibold mt-6">
              Why We Collect Information?
            </p>
            <p>We collect information in order to:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Schedule your appointments timely and accurately</li>
              <li>Keep track of your historical and current medical records</li>
              <li>Print your needed forms and prescriptions</li>
              <li>
                Conduct studies and researches for the purpose of reviewing,
                developing and making our system better to serve you
              </li>
              <li>
                Conduct profile analysis, behavioral modeling, analytics to
                understand patient needs, preferences and market trends to be
                able to develop or recommend suitable products and services
              </li>
            </ul>

            <p className="text-xl font-semibold mt-6">
              What Information is Collected?
            </p>
            <p>
              Personal and demographic information and vital statistics which
              includes but is not limited to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Personal information</li>
              <li>Historical and current medical information</li>
              <li>Medications/prescriptions</li>
              <li>Hemodialysis details</li>
              <li>Lab results</li>
              <li>PhilHealth Form details</li>
              <li>
                Non-personal/technical information (e.g., IP address,
                geolocation, operating system, browser type and version)
              </li>
              <li>Consumer feedback</li>
            </ul>

            <p className="text-xl font-semibold mt-6">Why Use Information?</p>
            <p>
              We utilize information for us to be able to generate your
              schedules, treatment sheets, prescriptions and other needed
              reports. Your information may also be used for study, analysis,
              and other functions required or permitted by law.
            </p>
            <p>
              We share your information so the CuraKidney system can continue to
              improve and provide service. For example, we might outsource
              database maintenance, privacy management, server security, system
              administration, website maintenance, or we may share your
              information to partner medical centers, hospitals, physicians, and
              other third parties to the extent permitted for by the law.
            </p>

            <p className="text-xl font-semibold mt-6">
              Where Do We Get Information?
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>When you fill out forms and documents</li>
              <li>When you log in</li>
              <li>
                When you give information to nurses, healthcare staff and
                physicians
              </li>
              <li>While using our system, website, and app</li>
              <li>From the principal member, in case you are a dependent</li>
              <li>Third-party analytic tools, including those using cookies</li>
              <li>
                From public sources, third parties, or other sources where
                consent or lawful access is granted
              </li>
            </ul>

            <p className="text-xl font-semibold mt-6">
              When Do We Share and To Whom?
            </p>
            <p>
              As we provide the system to you, we normally engage services of
              and interact with system developers, affiliated companies,
              advisors, and independent service providers, whether local or
              foreign.
            </p>
            <p>
              We may disclose your personal information for legitimate business
              purposes such as outsourced processing and analysis.
            </p>
            <p>
              We can also share your information with another
              CuraKidney-enrolled doctor or center (e.g., during a doctor’s
              leave or when transferring care), upon your consent.
            </p>
            <p>
              We will not share or disclose without your assent on this privacy
              agreement.
            </p>

            <p className="text-xl font-semibold mt-6">
              How Do We Protect Information?
            </p>
            <p>
              We maintain a set of controls to protect your information,
              including physical, electronic, technical, procedural, and
              organizational security measures.
            </p>
            <p>We protect your information through the following:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Using usernames and passwords</li>
              <li>Encryption</li>
              <li>Restricting access to information</li>
              <li>Regular review of audit trail</li>
              <li>Internal and external audits</li>
              <li>System updates</li>
              <li>Security briefings and trainings</li>
              <li>Data privacy and security assessments</li>
              <li>Future measures to tighten security</li>
            </ul>
            <p>
              We store your information in the cloud to fulfill system purposes,
              comply with agreements, or meet regulatory requirements.
            </p>

            <p className="text-xl font-semibold mt-6">Your Rights</p>
            <p>
              In accordance with the DPA, we uphold your right to your personal
              information. You have the right to be informed, to object, to
              access, edit, or delete your personal information upon request.
              You may also withdraw from mailing lists. Note that this may limit
              the full functionality of the system.
            </p>

            <p>
              For your questions, you may contact our Data Privacy Officer at:{" "}
              <a
                href="mailto:contactus@curakidney.com"
                className="text-blue-600 underline"
              >
                contactus@curakidney.com
              </a>
            </p>
            <p>
              <a
                href="https://www.curakidney.com"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.curakidney.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
