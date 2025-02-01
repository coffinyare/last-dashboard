import mongoose from "mongoose";
const maintenanceRequestSchema = new mongoose.Schema({

    tenantId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tenant', required: true },

    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    contractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor',
    },
    assignmentDate: {
        type: Date,
    },
});

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

export default MaintenanceRequest;
