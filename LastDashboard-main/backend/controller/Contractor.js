import Contractor from '../model/contracts.js';

// Create a new contractor
export const createContractor = async (req, res) => {
    try {
        const { name, email, phone, skills, available } = req.body;

        const newContractor = new Contractor({
            name,
            email,
            phone,
            skills,
            available,
        });

        await newContractor.save();
        res.status(201).json({ message: 'Contractor created successfully', data: newContractor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create contractor', error: error.message });
    }
};

// Get all contractors
export const getAllContractors = async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.status(200).json({ data: contractors });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve contractors', error: error.message });
    }
};

// Get a single contractor by ID
export const getContractorById = async (req, res) => {
    try {
        const { id } = req.params;
        const contractor = await Contractor.findById(id);

        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }

        res.status(200).json({ data: contractor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve contractor', error: error.message });
    }
};

// Update a contractor by ID-+
export const updateContractor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, skills, available } = req.body;

        const contractor = await Contractor.findByIdAndUpdate(
            id,
            { name, email, phone, skills, available },
            { new: true, runValidators: true }
        );

        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }

        res.status(200).json({ message: 'Contractor updated successfully', data: contractor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contractor', error: error.message });
    }
};

// Delete a contractor by ID
export const deleteContractor = async (req, res) => {
    try {
        const { id } = req.params;
        const contractor = await Contractor.findByIdAndDelete(id);

        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }

        res.status(200).json({ message: 'Contractor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contractor', error: error.message });
    }
};
