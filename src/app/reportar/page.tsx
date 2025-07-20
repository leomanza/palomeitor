import PigeonUploader from "@/components/PigeonUploader";
import { getDictionary } from "@/lib/i18n";

export default async function ReportPage() {
  const dict = await getDictionary();
  return (
    <div className="container mx-auto p-4 md:p-8 flex items-start justify-center">
      <PigeonUploader dict={dict.pigeonUploader} />
    </div>
  );
}
