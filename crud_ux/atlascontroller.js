const router = require('express').Router();
const db = require('./atlasdao');
const { tokenVerify, roleVerify } = require('./middleware');
const { Items } = require('./model'); // now Items is defined

// ---------- GET ALL ITEMS ----------
router.get('/', tokenVerify, roleVerify(['user','vendors','admin']), async (req, res) => {
  try {
    const records = await db.getAllRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// ---------- CREATE ITEM ----------
router.post('/', tokenVerify, roleVerify(['vendors','admin']), async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Item id is required' });

    // check duplicate id
    const exists = await db.getByCustomId(id);
    if (exists) return res.status(400).json({ error: 'Item id already exists' });

    const item = await db.createRecord({
      ...req.body,
      createdBy: req.user._id
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item', details: err.message });
  }
});

// ---------- UPDATE ITEM ----------
router.patch('/:id', tokenVerify, async (req, res) => {
  try {
    const item = await db.getByCustomId(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Only admin or creator can update
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString())
      return res.status(401).json({ error: 'Unauthorized' });

    const updated = await db.updateRecord(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item', details: err.message });
  }
});

// ---------- DELETE ITEM ----------
router.delete('/:id', tokenVerify, async (req, res) => {
  try {
    const item = await db.getByCustomId(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Only admin or creator can delete
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString())
      return res.status(401).json({ error: 'Unauthorized' });

    await db.deleteRecord(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
});

module.exports = router;
