import mongoose from "mongoose";
import Configuration from "../models/misc/Configuration.js";

export const getConfigurationItems = async (tableName) => {

  const config = await Configuration.findOne({ key: "allowed_config_tables" });

  const table = config.value.find(t => t.alias === tableName);

  if (!table) throw new Error("Unauthorized table");

  const Model = mongoose.model(table.model);
  return await Model.find();
};
