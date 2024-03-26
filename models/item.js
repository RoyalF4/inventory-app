const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, min: 1 },
  number_in_stock: { type: Number },
  members: { type: Boolean, require: true },
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual('price_formatted').get(function () {
  const localize = this.price.toLocaleString();
  return `${localize} ${this.price > 1 ? 'coins' : 'coin'}`;
});

module.exports = mongoose.model('Item', ItemSchema);
