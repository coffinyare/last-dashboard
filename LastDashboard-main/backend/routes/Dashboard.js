import express from "express";
import Tenant from "../model/Tenants.js";
import Property from "../model/properties.js";
import MaintenanceRequest from "../model/maintainance.js"; // Correct import

const router = express.Router();

// API endpoint to get counts
router.get("/dashboard", async (req , res ) => {
  try {
    const tenantCount = await Tenant.countDocuments();
    const propertyCount = await Property.countDocuments();
    const rentedPropertyCount = await Property.countDocuments({
      isRented: true,
    });

    // Count all maintenance requests
    const totalMaintenanceRequests = await MaintenanceRequest.countDocuments();
    const completedMaintenanceTasks = await MaintenanceRequest.countDocuments({
      status: "Completed",
    });

    // Respond with the counts
    res.json({
      totalTenants: tenantCount,
      totalProperties: propertyCount,
      totalRentedProperties: rentedPropertyCount,
      totalMaintenanceRequests, // Add maintenance counts here
      completedMaintenanceTasks, // Add completed maintenance counts here
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
