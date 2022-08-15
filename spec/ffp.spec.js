import FFP from "../index.js";

describe("ffp", () => {
  it("should filter out unnecessary points, Δ=1", function () {
    const ffp = FFP().result(({ index }) => index);
    const array = [3, 4, 5, 5, 1];
    expect(ffp(array)).toEqual([0, 3, 4]);
  });

  it("should filter out unnecessary points, Δ=0.5", function () {
    const ffp = FFP()
      .maxDeltaY(0.5)
      .result(({ index }) => index);
    const array = [3, 4, 5, 5, 1, 0];
    expect(ffp(array)).toEqual([0, 2, 3, 4, 5]);
  });

  it("should work for hashes, Δ=0.5", function () {
    const ffp = FFP()
      .maxDeltaY(0.5)
      .x(({ x }) => x)
      .y(({ y }) => y)
      .result(({ index }) => index);
    const array = [
      { x: 0, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 1 },
      { x: 5, y: 0 },
    ];
    expect(ffp(array)).toEqual([0, 2, 3, 4, 5]);
  });
});
