const currencyFormatter = (amount) => {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return formatter.format(Number(amount))
};

export default currencyFormatter;
