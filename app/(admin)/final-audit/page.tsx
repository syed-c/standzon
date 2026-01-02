import FinalAuditReport from '@/components/client/FinalAuditReport';
import AdminLayout from '@/components/client/AdminLayout';
import Sidebar from '@/components/client/Sidebar';
import Topbar from '@/components/client/Topbar';

export default function FinalAuditPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <FinalAuditReport />
    </AdminLayout>
  );
}