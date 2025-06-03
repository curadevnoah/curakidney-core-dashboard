import { Link } from "react-router";
import PageMeta from "@/components/_archives/common/PageMeta";

export default function DataPolicy() {
  return (
    <>
      <PageMeta title="Data Policy" />

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
          <h1 className="text-3xl text-center font-bold">Data Policy</h1>

          <div className="px-4 py-8 space-y-4 text-gray-800">
            <p className="text-2xl font-bold">Data Retention Policy</p>
            <p>
              It is the obligation of CuraKidney to practice proper retention
              and disposal of records. CuraKidney is committed to effective and
              consistent record management that maintains the privacy and
              security of information and ensures retention for the required
              duration.
            </p>
            <p>
              CuraKidney aims to prevent the mishandling and early discarding of
              records which need to be preserved for a specific period and to
              allow removal of records not required for permanent retention.
            </p>
            <p>
              Data stored within CuraKidney includes, but is not limited to,
              patient health record, hospitalization history, vaccination
              history, dialysis treatment record, medications and prescriptions,
              laboratory results and imaging, statements of account, and
              insurance documents.
            </p>
            <p>
              The retention of document data is tied to the status of the
              patient’s record. Active patients will have their full data stored
              as long as there is platform-related activity. For patients who
              are tagged deceased/expired and for patients who have inactive
              records, data will be stored in the CuraKidney databases and will
              be available for at least ten (10) years.
            </p>

            <p className="text-2xl font-bold mt-6">Data Disposal Policy</p>
            <p>
              CuraKidney, due to its nature being an electronic medical record,
              can automatically track the vintage of each patient’s record. Any
              patient who is tagged as deceased/expired and any patient who has
              inactive records will continue to be stored in the CuraKidney
              databases and will be available for at least ten (10) years. Upon
              fulfillment of this period, CuraKidney reserves the right to
              permanently delete these records from its databases.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
