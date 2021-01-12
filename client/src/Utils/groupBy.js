import * as R from "ramda";

const groupByDate = (isDaily) => R.groupBy((items) => {
  let options = {
    year:"numeric",
    month: "long",
  }

  if (isDaily) {
    options["day"] = "numeric"
  }

 return new Date(items.date).toLocaleString(undefined, options)});

const groupDaily = (items) => groupByDate(true)(items)

export { groupDaily };
