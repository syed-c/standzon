import FinalAuditReport from '@/components/FinalAuditReport';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function FinalAuditPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <FinalAuditReport />
    </AdminLayout>
  );
}