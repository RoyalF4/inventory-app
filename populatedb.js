#! /usr/bin/env node

console.log(
  'This script populates some test category and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://royal2791:TP1ditYaoxz2vCpc@inventory-app.zupdadq.mongodb.net/?retryWrites=true&w=majority&appName=inventory-app"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock,
  members
) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
    members: members,
  };

  const item = new Item(itemDetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories...');
  await Promise.all([
    categoryCreate(
      0,
      'Armor',
      "Armour describes any item worn to provide Defence. Defence bonuses decrease a player's chance of being hit. Armour comes in many shapes and forms for all classes giving the player a variety of bonuses to choose from. To wear armour of different metal types, certain Defence levels are required. Good armour is recommended when attacking enemies of a higher level, as the higher defences give the opponent less opportunity to do damage. "
    ),
    categoryCreate(
      1,
      'Weapons',
      'Weapons are worn equipment in the weapon slot used to deal damage in combat. One-handed weapons can be used with a shield in the shield slot and two-handed weapons prevent the use of the shield slot.'
    ),
    categoryCreate(
      2,
      'Food',
      'Food is what enables the player to regain Hitpoints, although some foods may have other effects as well.'
    ),
  ]);
}

async function createItems() {
  console.log('Adding items...');
  await Promise.all([
    itemCreate(
      0,
      'Rune platebody',
      'Provides excellent protection.',
      categories[0],
      38280,
      69,
      false
    ),
    itemCreate(
      1,
      'Bandos tassets',
      'A sturdy pair of tassets.',
      categories[0],
      20950168,
      7,
      true
    ),
    itemCreate(
      2,
      'Scythe of vitur',
      'A powerful scythe.',
      categories[1],
      1115628118,
      0,
      true
    ),
    itemCreate(
      3,
      'Rune scimitar',
      'A vicious, curved sword.',
      categories[1],
      14991,
      420,
      false
    ),
    itemCreate(
      4,
      'Lobster',
      'This looks tricky to eat.',
      categories[2],
      174,
      1345,
      false
    ),
    itemCreate(
      5,
      'Shark',
      "I'd better be careful eating this.",
      categories[2],
      1007,
      567,
      true
    ),
  ]);
}
