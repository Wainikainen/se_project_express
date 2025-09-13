const { get } = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const createItem =(req,res) => {
const { name, weather, imageUrl } = req.body;
ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
.then((item) => {
  res.status(201).send(item)
})
 .catch((err) => {
      console.error(err)
      if (err.name === "ValidationError") {
          return res.status(400).send({ message: err.message });
      }
       return res.status(500).send({ message: err.message });
    })
};

const getItems = (req, res) => {
ClothingItem.find({})
.then((items) => res.status(200).send(items))
.catch((err) => {
  console.error(err);
    return res.status(400).send({ message: err.message });
});
};

const likeItem = (req,res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    return res.status(500).send({ message: err.message });
  });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
   .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    return res.status(500).send({ message: err.message });
  });
};

const deleteItem = (req,res) => {
const { itemId } = req.params;
ClothingItem.findByIdAndDelete(itemId)
.then((item) => {
if (!item) {
  return res.status(404).send({ message: "Item not found!" });
}
res.status(200).send({ message: "Item Deleted!", item });
})
.catch((err) => {
  console.error(err);
  return res.status(500).send({ message: err.message });
});
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };