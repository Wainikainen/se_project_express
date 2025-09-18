const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};




const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) =>{
      if(!item) {
        throw new Error( "Not found!"  )
      }
      res.status(200).send(item)

    })
    .catch((err) => {
      if(err.message === "Not found!" ) {
       return res.status(NOT_FOUND).send({ message: "Not found!"  })
      }
      console.error(err);
      return res.status(BAD_REQUEST).send({ message: err.message });
    });
};





const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) =>{
      if(!item) {
        throw new Error("Not found!")
      }
     res.status(200).send(item)
    })
    .catch((err) => {
      if(err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });

      }
      if(err.message === "Not found!"){
      return res.status(NOT_FOUND).send({ message: err.message });

      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found!!!" });
      }

      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "Only can delete your own items!" });
      }
      res.status(200).send({ message: "Item Deleted!", item });
    })
    .catch((err) => {
      if(err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
