const Profile = require('../models/Profile');
const axios = require('axios');

exports.addProfile = async (req, res) => {
    const { linkedinId } = req.body;
    try {
        // Récupérer les données via l'API LinkedIn
        const response = await axios.get(`https://api.linkedin.com/v2/people/(id:${linkedinId})`, {
            headers: {
                Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
            },
        });

        const { firstName, lastName, position } = response.data;

        const profile = await Profile.create({
            linkedinId,
            firstName,
            lastName,
            position,
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await Profile.findOne({ where: { linkedinId: id } });
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    try {
        // Récupérer les données via l'API LinkedIn
        const response = await axios.get(`https://api.linkedin.com/v2/people/(id:${id})`, {
            headers: {
                Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
            },
        });

        const { firstName, lastName, position } = response.data;

        const profile = await Profile.findOne({ where: { linkedinId: id } });
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.position = position;
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
