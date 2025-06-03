import PageBreadcrumb from "../../../components/_archives/common/PageBreadCrumb";
import ResponsiveImage from "../../../components/_archives/ui/images/ResponsiveImage";
import TwoColumnImageGrid from "../../../components/_archives/ui/images/TwoColumnImageGrid";
import ThreeColumnImageGrid from "../../../components/_archives/ui/images/ThreeColumnImageGrid";
import ComponentCard from "../../../components/_archives/common/ComponentCard";
import PageMeta from "../../../components/_archives/common/PageMeta";

export default function Images() {
  return (
    <>
      <PageMeta
        title="React.js Images Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Images page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </>
  );
}
