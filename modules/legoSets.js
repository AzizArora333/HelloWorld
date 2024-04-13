/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Aziz
*Student ID: 138943220
* Date: 10-04-2024
********************************************************************************/

//added the "dotenv" module to access this module with database

  
require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });
const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Set.belongsTo(Theme, { foreignKey: "theme_id" });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}


function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({ include: [Theme] })
      .then((sets) => {
        resolve(sets);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({
      where: { set_num: setNum },
      include: [Theme],
    })
      .then((set) => {
        if (set) {
          resolve(set);
        } else {
          reject(new Error("Unable to find requested set"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
      const decodedTheme = decodeURIComponent(theme);
      Set.findAll({
          include: [Theme], 
          where: {
              '$Theme.name$': {
                  [Sequelize.Op.iLike]: `%${decodedTheme}%` 
              }
          }
      })
          .then(sets => {
              if (sets.length > 0) {
                  resolve(sets);
              } else {
                  reject("Unable to find requested sets");
              }
          })
          .catch(error => {
              reject(error);
          });
  });

}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create(setData)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll()
      .then((themes) => {
        resolve(themes);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function editSet(setNum, setData) {
  return new Promise((resolve, reject) => {
    Set.update(setData, {
      where: { set_num: setNum },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(
          error.errors && error.errors.length > 0
            ? error.errors[0].message
            : "An error occurred while updating the set."
        );
      });
  });
}

function deleteSet(setNum) {
  return new Promise((resolve, reject) => {
    Set.destroy({
      where: { set_num: setNum },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}
module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet,
};