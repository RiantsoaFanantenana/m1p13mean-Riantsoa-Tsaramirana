const UserType = require("../models/user/UserType");
const ShopType = require("../models/shop/ShopType");
const SubscriptionType = require("../models/mall/SubscriptionType");

const referenceIds = {}; // objet global pour stocker les ids

const populateReferenceIds = async () => {
  // UserType
  const userTypes = await UserType.find({});
  userTypes.forEach(type => {
    referenceIds[`${type.name}_id`] = type._id; 
  });

  // ShopType
  const shopTypes = await ShopType.find({});
  shopTypes.forEach(type => {
    referenceIds[`${type.name}_id`] = type._id; 
  });

  // SubscriptionType
  const subscriptionTypes = await SubscriptionType.find({});
  subscriptionTypes.forEach(type => {
    referenceIds[`${type.name}_id`] = type._id; 
  });

  console.log("✅ Reference IDs cached");
};

module.exports = { referenceIds, populateReferenceIds };
