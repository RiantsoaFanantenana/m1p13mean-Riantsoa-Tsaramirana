import { getConfigurationItems } from "../services/config.service.js";

export const getConfigTable = async (req, res) => {
  try {
    const { tableName } = req.params;

    const data = await getConfigurationItems(tableName);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
