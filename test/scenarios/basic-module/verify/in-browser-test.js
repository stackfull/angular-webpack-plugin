
describe("basic-module", function(){

  it('exports the angular module', function(){
    var m = require('main');
    expect(m.main.name).toBe('main');
  });

});
