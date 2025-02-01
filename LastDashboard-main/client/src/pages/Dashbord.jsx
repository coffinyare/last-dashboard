import React, { useEffect, useState } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const Dashboard = () => {
  const [stats, setStats] = useState({
    tenantCount: 0,
    availablePropertyCount: 0,
    pendingMaintenanceCount: 0,
    completedMaintenanceCount: 0,
  });

  // Fetch stats data from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stats");
        const data = await response.json();
        console.log("Fetched stats data:", data); // Log the data
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Tenants"
            icon={Users}
            value={stats.tenantCount}
            color="#6366F1"
          />
          <StatCard
            name="Available Properties"
            icon={ShoppingBag}
            value={stats.availablePropertyCount}
            color="#8B5CF6"
          />
          <StatCard
            name="Pending Maintenance"
            icon={Zap}
            value={stats.pendingMaintenanceCount}
            color="#EC4899"
          />
          <StatCard
            name="Completed Maintenance"
            icon={BarChart2}
            value={stats.completedMaintenanceCount}
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
