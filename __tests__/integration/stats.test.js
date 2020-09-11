const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

const { Stats } = require('../../src/app/models');

describe('Register', () => {

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

  it('shold return file stats list', (done) => {
    request(app).get('/stats')
    .set('Accept','application/json')
    .send({path: 'https://github.com/carloseduardovieira'})
    .expect( 200, done );
  });

});
