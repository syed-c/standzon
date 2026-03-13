import AdminClaimsManager from '@/components/AdminClaimsManager';

export default function ProfileClaimsPage() {
  return (
    <AdminClaimsManager 
      adminId="admin-001"
      permissions={['claims.manage', 'builders.manage', 'notifications.send']}
    />
  );
}
