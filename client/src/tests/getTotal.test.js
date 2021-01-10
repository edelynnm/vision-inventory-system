import getTotal from "../Utils/getTotal";

describe("get total price in STRING with 2 DECIMALS, given [item: {total_price}] , ITEM = 1", () => {
  it("total_price positive integer", () => {
    expect(getTotal([{total_price: 170}])).toBe("170.00")
  });

  
  it("total_price in decimal", () => {
    expect(getTotal([{total_price: 52.5}])).toBe("52.50")
  });
});

describe("get total price in STRING with 2 DECIMALS, given [item: {total_price}] , ITEM > 1", () => {
  it("total_price positive integer", () => {
    expect(getTotal([{total_price: 100},{total_price: 150}])).toBe("250.00")
  });
  
  it("total_price in decimal", () => {
    expect(getTotal([{total_price: 176.75}, {total_price: 1500.7}])).toBe("1677.45")
  });
});