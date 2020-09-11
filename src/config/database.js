module.exports = {
  host:             '127.0.0.1',
  username:         'carlos',
  password:         'cEdu4rd0',
  database:         'trustly',
  dialect:          'postgres',
  logging:          false,
  define: {
    timestamps:     true,
    underscored:    true, //force underscore format in to table name 
    underscoredAll: true //force underscore format in to rows name 
  },
};
