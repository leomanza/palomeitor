import { getDictionary } from '@/lib/i18n';
import ReportsPageContent from '@/components/ReportsPageContent';

export default async function ReportsPage() {
    const dict = await getDictionary();
    // We no longer fetch initial reports here, it will be done in real-time in the client component
    return <ReportsPageContent dict={dict} />;
}
