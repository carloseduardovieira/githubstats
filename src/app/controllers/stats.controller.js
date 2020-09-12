const { Stats } = require('../models');
const { Search } = require('../models');
const validateUrl = require('../shared/validateGithubUrl');

const Github = require('../classes/github');

class StatsController {

  async getStats ( req, res ) {

    const { url } = req.body;

    const validation = validateUrl(url);

    if ( !validation.status ) {
      return res.status(400).json({message: validation.message});
    }
    
  }
}

module.exports = new StatsController();
