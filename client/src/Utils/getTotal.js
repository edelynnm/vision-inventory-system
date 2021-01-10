const getTotal = (itemsBought) => {
  let total = 0;
  if (itemsBought.length !== 0) {
    const prices = itemsBought.map((item) => Number(item.total_price));
    total = prices.reduce((acc, val) => acc + val);
  }
  return total.toFixed(2);
};

export default getTotal;
