module.exports = ( sequelize, DataTypes ) => {
  const Search = sequelize.define('Search', {
    repository: DataTypes.STRING,
  });

  return Search;
}
