import { groupDaily } from "../Utils/groupBy";

//items already formatted without time from database

const items1 = [
  {
    date: "2021-01-10T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 1
  },
  {
    date: "2021-01-09T16:00:00.000Z",
    itemcode: "8935001882992",
    sold: 4
  },
  {
    date: "2021-01-09T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 10
  },
  {
    date: "2021-01-10T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 5
  },
];

const items2 = [
  {
    date: "2020-12-20T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 5
  },
  {
    date: "2020-12-21T16:00:00.000Z",
    itemcode: "8935001882992",
    sold: 10
  },
  {
    date: "2020-11-28T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 1
  },
  {
    date: "2020-11-28T16:00:00.000Z",
    itemcode: "4902505221484",
    sold: 4
  },
]

describe("group by date", () => {
  it("group according to day", () => {
    expect(groupDaily(items1)).toEqual({
      "11 January 2021": [
        {
          date: "2021-01-10T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 1
        },
        {
          date: "2021-01-10T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 5
        }
      ],
      "10 January 2021": [
        {
          date: "2021-01-09T16:00:00.000Z",
          itemcode: "8935001882992",
          sold: 4
        },
        {
          date: "2021-01-09T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 10
        }
      ]
    });
  });

  it("group according to day, given item2 values", () => {
    expect(groupDaily(items2)).toEqual({
      "21 December 2020": [
        {
          date: "2020-12-20T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 5
        }
      ],
      "22 December 2020": [
        {
          date: "2020-12-21T16:00:00.000Z",
          itemcode: "8935001882992",
          sold: 10
        }
      ],
      "29 November 2020": [
        {
          date: "2020-11-28T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 1
        },
        {
          date: "2020-11-28T16:00:00.000Z",
          itemcode: "4902505221484",
          sold: 4
        }
      ]
    }
    );
  });
}); 
