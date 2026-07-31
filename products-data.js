/*
  全站产品资料

  以后首页精选和定制类产品页面都读取这里的数据。

  字段说明：
  id：产品唯一编号
  name：产品名
  category：鞋类 / 化妆包 / 服装 / 帽子与配饰
  year：上架年份
  sales：当前销量，必须填写数字，用于自动排序
  sku：商品货号
  concept：设计理念
  featured：是否参与首页精选
  images：三张轮播图的准确路径

  首页会自动：
  1. 筛选 featured 为 true 的产品
  2. 按 sales 从高到低排序
  3. 只展示前 8 个
*/

window.PRODUCTS = [
  {
    id: "demo-shoes-01",
    name: "示例鞋款一",
    category: "鞋类",
    year: "2025",
    sales: 1000,
    sku: "示例货号-001",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-bag-01",
    name: "示例化妆包一",
    category: "化妆包",
    year: "2025",
    sales: 800,
    sku: "示例货号-002",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-clothing-01",
    name: "示例服装一",
    category: "服装",
    year: "2024",
    sales: 600,
    sku: "示例货号-003",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-accessory-01",
    name: "示例帽子一",
    category: "帽子与配饰",
    year: "2026",
    sales: 500,
    sku: "示例货号-004",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-shoes-02",
    name: "示例鞋款二",
    category: "鞋类",
    year: "2025",
    sales: 400,
    sku: "示例货号-005",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-bag-02",
    name: "示例化妆包二",
    category: "化妆包",
    year: "2024",
    sales: 300,
    sku: "示例货号-006",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-clothing-02",
    name: "示例服装二",
    category: "服装",
    year: "2025",
    sales: 200,
    sku: "示例货号-007",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  },
  {
    id: "demo-accessory-02",
    name: "示例配饰一",
    category: "帽子与配饰",
    year: "2026",
    sales: 100,
    sku: "示例货号-008",
    concept: "这里是示例设计理念。收到真实产品文件夹后会替换。",
    featured: true,
    images: ["", "", ""]
  }
];
