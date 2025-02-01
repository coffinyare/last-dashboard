import React from 'react'

import MaintenanceTable from '../components/maintenance/MaintenanceTable'
import Header from '../components/common/Header'

export default function Maintenance() {
  return (
    <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4">
     <Header title={"maintenance"} />
      <MaintenanceTable />
    </div>
  )
}
