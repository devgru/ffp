import FFP from '../dist.js';

describe('ffp', () => {
  it('should filter out unnecessary points, Δ=1', function () {
    const ffp = FFP()
      .result(({index}) => index);
    let array = [3, 4, 5, 5, 1];
    expect(ffp(array)).toEqual([0, 3, 4]);
  });
  
  it('should filter out unnecessary points, Δ=0.5', function () {
    const ffp = FFP()
      .maxDelta(0.5)
      .result(({index}) => index);
    let array = [3, 4, 5, 5, 1, 0];
    expect(ffp(array)).toEqual([0, 2, 3, 4, 5]);
  });
});
