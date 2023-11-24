const sponsorModel = require('../models/sponsorModel');

async function getAllSponsors(req, res) {
    try {
        const sponsors = await sponsorModel.getAllSponsors();
        res.status(200).json({ data: sponsors });
    } catch (error) {
        console.error('Error in getAllSponsors controller:', error);
        res.status(500).json({ error: error.message });
    }
}