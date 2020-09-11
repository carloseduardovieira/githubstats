module.exports = ( sequelize, DataTypes ) => {
  const Stats = sequelize.define('Stats', {
    name:       DataTypes.STRING,
    extension:  DataTypes.STRING,
    lines:      DataTypes.INTEGER,
    bytes:      DataTypes.INTEGER,
  });

  return Stats;
};
