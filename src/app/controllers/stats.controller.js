const { Stats } = require('../models');
const { Search } = require('../models');
const validateUrl = require('../shared/validateGithubUrl');

const htmlReader = require('../classes/htmlReader');

class StatsController {

  async getStats ( req, res ) {

    
    const { url } = req.body;
    
    const validation = validateUrl(url);
    
    if ( !validation.status ) {
      return res.status(400).json({message: validation.message});
    }
    
    try {
      const matches = await htmlReader.readRepository(url);
      return res.json({ repository: matches });  
    } catch ( error ) {
      console.error(error);
    }

    // return res.json({ repository: matches });
    

    // const lastSearch = await Search.findOne({ where: { repository: url } });

    // if ( lastSearch ) {
    //   return;
    // }

    // try {
    //   const path = await Search.create({ repository: url });
    //   return res.json({ path });
    // } catch( error ) {
    //   console.error(error);
    // }


    // const fileStats = await Stats.findAll();

    // if ( !fileStats ) {
    //   return res.status(401).json({message: 'File not found'});
    // }

    // return res.json({ file: fileStats, path: Github.getRepository() });
  }
}

module.exports = new StatsController();
