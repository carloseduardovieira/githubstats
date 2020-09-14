const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

const { Stats } = require('../../src/app/models');

describe('Register Stats', () => {

  beforeEach( async () => {
    await truncate();
  });

  it('should create file', async () => {
    const stats = await Stats.create({
      name: 'file1',
      extension: 'json',
      lines: '1045',
      bytes: '2020' 
    });
    
    expect(stats.name).toBe('file1');
  });

  it('should return error if there are invalid parameters', async () => {
    const stats = await Stats.create({
      extension: 'json',
      lines: '1045',
      bytes: '2020' 
    }).catch((error) => {
      expect(error).toBeTruthy();
    });
  });

  it('should return all file stats', async () => {
    await request(app).get('/stats')
    .set('Accept','application/json')
    .send({url: 'https://github.com/carloseduardovieira/conexao-php-pdo'}).then((sucess) => {
      return Stats.findAll();
    }).then( stats => {
      expect(stats.length).toBeTruthy();
    });
  }, 3000000);

});
