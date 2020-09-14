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

      const lastSearch = await Search.findOne({ where: { repository: url } });

      if ( lastSearch ) {
        const fileStats = await Stats.findAll({
          attributes:['name', 'extension', 'lines', 'bytes'],
          where: {
            repositoryId: lastSearch.id
          },
          group: ['extension', 'name', 'lines', 'bytes'],
          raw: true
        });
        return res.json({ stats: fileStats });
      }

      let filesStats = await htmlReader.readRepository([validation.url]);
      filesStats = filesStats.sort( (a,b) => {
        return a.extension === b.extension ? 0 : +(a.extension > b.extension) || -1;
      });

      const searchedRepository = await Search.create({ repository: url });

      filesStats = filesStats.map( file => {
        file.repositoryId = searchedRepository.id;
        return file;
      });
      
      await Stats.bulkCreate(filesStats).then(() => {
        return Stats.findAll({
          attributes:['name', 'extension', 'lines', 'bytes'],
          where: {
            repositoryId: searchedRepository.id
          },
          group: ['extension', 'name', 'lines', 'bytes'],
          raw: true
        });
      }).then( stats => {
        return res.json({ stats: stats });
      });

    } catch ( error ) {
      return res.status(500).json({message: 'An unexpected error occurred while processing your request'});
    }
  }
}

module.exports = new StatsController();
