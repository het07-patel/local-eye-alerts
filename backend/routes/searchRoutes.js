
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// Search problems by pincode
router.get('/pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }
    
    // Search for problems where the address contains the pincode
    const problems = await Problem.find({
      'location.address': { $regex: pincode, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    res.json(problems);
  } catch (err) {
    console.error('Pincode search error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
