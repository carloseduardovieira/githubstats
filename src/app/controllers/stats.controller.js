const { Stats } = require('../models');

class StatsController {
  async getStats ( req, res ) {
    const { path } = req.body;

    const fileStats = await Stats.findAll();

    if ( !fileStats ) {
      return res.status(401).json({message: 'File not found'});
    }

    return res.status(200).send(fileStats);
  }
}

module.exports = new StatsController();
