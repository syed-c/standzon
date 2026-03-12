import React from 'react';
import DeploymentsPanel from '@/components/DeploymentsPanel';

const DeploymentsPage = () => {
  return (
    <>
      <div className="overflow-auto">
        <DeploymentsPanel />
      </div>
    </>
  );
};

export default DeploymentsPage;