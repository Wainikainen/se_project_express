const ClothingItem = require("../models/clothingItem");
const {
  BadRequest,
  NotFound,
  ServerError,
  ForbiddenError,
} = require("../middlewares/error");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return next(new BadRequest(err.message));
      return next(new ServerError(err.message));
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(new ServerError(err.message)));
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) return next(new NotFound("Item not found"));
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") return next(new BadRequest(err.message));
      next(new ServerError(err.message));
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) return next(new NotFound("Item not found"));
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") return next(new BadRequest(err.message));
      next(new ServerError(err.message));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) return next(new NotFound("Item not found"));
      if (!item.owner.equals(req.user._id))
        return next(new ForbiddenError("Only can delete your own items!"));
      res.status(200).send({ message: "Item Deleted!", item });
    })
    .catch((err) => {
      if (err.name === "CastError") return next(new BadRequest(err.message));
      next(new ServerError(err.message));
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
