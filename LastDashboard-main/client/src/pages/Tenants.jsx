import Header from "../components/common/Header";
import TenantTable from "../components/Tenant/TenantTable";
import React from "react";

const TenantsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Tenants' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

				
				<TenantTable /> {/* Displaying sales data table */}

				

			</main>
		</div>
	);
};

export default TenantsPage;
