import mongoose from "mongoose";
import Configuration from "../models/Configuration.js";

export const getConfigurationItems = async (tableName) => {

  const config = await Configuration.findOne({ key: "allowed_config_tables" });

  if (!config || !config.value.includes(tableName)) {
    throw new Error("Unauthorized configuration table");
  }

  if (!mongoose.models[tableName]) {
    throw new Error("Model not found");
  }

  const Model = mongoose.model(tableName);

  return await Model.find();
};
