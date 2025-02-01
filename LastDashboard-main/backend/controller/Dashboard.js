import Tenant from "../model/Tenants.js";
import Property from "../model/properties.js";
import MaintenanceRequest from "../model/MaintenanceRequest.js"; // Ensure the import is correct



// Controller function to get counts
export const getCounts = async (req, res) => {
  try {
    const tenantCount = await Tenant.countDocuments();
    const propertyCount = await Property.countDocuments();
    const rentedPropertyCount = await Property.countDocuments({
      isRented: true,
    });

    // Count all maintenance requests
    const totalMaintenanceRequests = await MaintenanceRequest.countDocuments();

    const completedMaintenanceTasks = await MaintenanceRequest.countDocuments({
      status: "Completed", // Ensure the status value matches exactly as defined in your schema's enum
    });

    // Respond with the counts
    res.json({
      totalTenants: tenantCount,
      totalProperties: propertyCount,
      totalRentedProperties: rentedPropertyCount,
      totalMaintenanceRequests, // Add this line
      completedMaintenanceTasks, // Add this line
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
