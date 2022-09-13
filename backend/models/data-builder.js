const { ObjectId } = require("mongodb");

class DataBuilder {
  constructor(category, userId) {
    this.category = category;
    this.userId = userId;
  }

  setCategory(category) {
    this.category = category;
  }

  getTotalSumsByCategorySortedPipeline() {
    return [
      {
        $match: {
          creator: ObjectId(this.userId),
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
          },
          totalSum: {
            $sum: "$price_usd",
          },
        },
      },
      {
        $sort: {
          totalSum: -1,
        },
      },
    ];
  }

  getTotalSumPipeline() {
    return [
      {
        $match: {
          creator: ObjectId(this.userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSum: {
            $sum: "$price_usd",
          },
        },
      },
    ];
  }

  getTotalSumByCategoryPipeline() {
    return [
      {
        $match: {
          category: this.category,
          creator: ObjectId(this.userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSum: {
            $sum: "$price_usd",
          },
        },
      },
    ];
  }

  getTotalSumsByCategoryAndAssetPipeline() {
    return [
      {
        $match: {
          category: this.category,
          creator: ObjectId(this.userId),
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
            assetId: "$asset_id",
            symbol: "$symbol",
          },
          totalSum: {
            $sum: "$price_usd",
          },
          totalSumInOriginalCurrency: {
            $sum: "$price",
          },
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
    ];
  }

  getBoughtItemsPerCategory() {
    return [
      {
        $match: {
          category: this.category,
          creator: new ObjectId(this.userId),
          type: 0,
        },
      },
      {
        $sort: {
          type: -1,
          date: -1,
        },
      },
    ];
  }

  getSoldItemsPerCategory() {
    return [
      {
        $match: {
          category: this.category,
          creator: new ObjectId(this.userId),
          type: 1,
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
          },
          totalSum: {
            $sum: "$price",
          },
          date: { $min: "$date" },
        },
      },
    ];
  }

  getTransactionsPerMonths() {
    return [
      {
        $group: {
          _id: {
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$date",
                },
              },
            },
          },
          transactions: {
            $push: {
              date: "$date",
              name: "$name",
              type: "$type",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ];
  }
}

module.exports = DataBuilder;
