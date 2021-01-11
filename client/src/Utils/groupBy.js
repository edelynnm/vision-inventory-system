const groupBy = (prop, array) => {

  const results = array.reduce((acc, val) => {
    const key = val[prop];
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(val)
    return acc;
  }, {});

  return results;
};

const groupByDate = (array) => {
  return groupBy("date", array);
};

export default groupByDate;
