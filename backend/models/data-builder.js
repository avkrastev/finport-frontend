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
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
    ];
  }
}

module.exports = DataBuilder;
