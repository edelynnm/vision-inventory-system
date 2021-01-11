import getTotal from "../Utils/getTotal";

describe("get total price in STRING with 2 DECIMALS, given [item: {total_price}] , ITEM = 1", () => {
  it("total_price in decimal, given 0", () => {
    expect(getTotal([{total_price: 0}])).toBe("0.00")
  });

  it("total_price positive integer", () => {
    expect(getTotal([{total_price: 170}])).toBe("170.00")
  });

  it("total_price in decimal", () => {
    expect(getTotal([{total_price: 52.5}])).toBe("52.50")
  });

  it("total_price string", () => {
    expect(getTotal([{total_price: "114"}])).toBe("114.00")
  });
});

describe("get total price in STRING with 2 DECIMALS, given [item: {total_price}] , ITEM > 1", () => {
  it("total_price positive integer", () => {
    expect(getTotal([{total_price: 100},{total_price: 150}])).toBe("250.00")
  });
  
  it("total_price in decimal", () => {
    expect(getTotal([{total_price: 176.75}, {total_price: 1500.7}])).toBe("1677.45")
  });

  it("total_price in string", () => {
    expect(getTotal([{total_price: "176.8"}, {total_price: "12.3"}])).toBe("189.10")
  });
});

describe("ITEM > 1, price includes string numeric", () => {
  it("total_price", () => {
    expect(getTotal([{total_price: 100},{total_price: "152.75"}, {total_price: 1400.10}])).toBe("1652.85")
  });
});
