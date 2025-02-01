import Tenant from "../model/Tenants.js";
import MaintenanceRequest from "../model/maintainance.js";
import Property from "../model/properties.js";

export const getStats = async (req, res) => {
  try {
    const tenantCount = await Tenant.countDocuments();

    // Count available properties (assuming isRented: false means available)
    const availablePropertyCount = await Property.countDocuments({
      isRented: false,
    });

    // Count rented properties (assuming isRented: true means rented)
    const rentedPropertyCount = await Property.countDocuments({
      isRented: true,
    });

    const pendingMaintenanceCount = await MaintenanceRequest.countDocuments({
      status: "Pending",
    });
    const completedMaintenanceCount = await MaintenanceRequest.countDocuments({
      status: "Completed",
    });

    res.json({
      tenantCount,
      availablePropertyCount,
      rentedPropertyCount,
      pendingMaintenanceCount,
      completedMaintenanceCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
