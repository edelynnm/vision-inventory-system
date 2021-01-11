import groupByDate from "../Utils/groupBy";

//items already formatted without time from database

const items1 = [
  {
    date: "2021-01-10T16:00:00.000Z",
    itemcode: "4902505221484",
  },
  {
    date: "2021-01-09T16:00:00.000Z",
    itemcode: "8935001882992",
  },
  {
    date: "2021-01-09T16:00:00.000Z",
    itemcode: "4902505221484",
  },
]

const items2 = [
  {
    date: "2020-12-20T16:00:00.000Z",
    itemcode: "4902505221484",
  },
  {
    date: "2020-12-21T16:00:00.000Z",
    itemcode: "8935001882992",
  },
  {
    date: "2020-11-28T16:00:00.000Z",
    itemcode: "4902505221484",
  },
  {
    date: "2020-11-28T16:00:00.000Z",
    itemcode: "4902505221484",
  },
]
  

describe("group by date", () =>{
  it("group according to day", () => {
    expect(groupByDate(items1)).toEqual(
      {
        "2021-01-10T16:00:00.000Z": [
          {
            date: "2021-01-10T16:00:00.000Z",
            itemcode: "4902505221484",
          },
        ],
        "2021-01-09T16:00:00.000Z": [
          {
            date: "2021-01-09T16:00:00.000Z",
            itemcode: "8935001882992",
          },
          {
            date: "2021-01-09T16:00:00.000Z",
            itemcode: "4902505221484",
          }
        ]
      }
    )
  })

  it("group according to day, given item2 values", () => {
    expect(groupByDate(items2)).toEqual(
      {
        "2020-12-20T16:00:00.000Z": [{
          date: "2020-12-20T16:00:00.000Z",
          itemcode: "4902505221484",
        }],
        "2020-12-21T16:00:00.000Z": [{
          date: "2020-12-21T16:00:00.000Z",
          itemcode: "8935001882992",
        }],
        "2020-11-28T16:00:00.000Z": [{
          date: "2020-11-28T16:00:00.000Z",
          itemcode: "4902505221484",
        },
        {
          date: "2020-11-28T16:00:00.000Z",
          itemcode: "4902505221484",
        }],
      }
    )
  })
})