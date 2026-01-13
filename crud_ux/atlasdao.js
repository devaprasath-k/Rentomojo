const { Items } = require('./model');

// GET all items
const getAllRecords = async () => Items.find();

// GET by MongoDB _id
const getById = async (_id) => Items.findById(_id);

// GET by custom id
const getByCustomId = async (id) => Items.findOne({ id });

// CREATE item
const createRecord = async (data) => {
  const item = new Items(data);
  return await item.save();
};

// UPDATE item by custom id
const updateRecord = async (id, updatedData) => {
  return await Items.findOneAndUpdate({ id }, updatedData, { new: true });
};

// DELETE item by custom id
const deleteRecord = async (id) => {
  return await Items.findOneAndDelete({ id });
};

module.exports = {
  getAllRecords,
  getById,
  getByCustomId,
  createRecord,
  updateRecord,
  deleteRecord
};
