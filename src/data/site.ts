export const site = {
  name: "Leone1111",
  title: "Leone1111 | Materials, Machine Learning and DFT",
  description:
    "材料、机器学习与 DFT 方向博士生的个人学术主页，展示研究方向、科研博客、项目作品和联系方式。",
  email: "haoluo2025@163.com",
  github: "https://github.com/Leone1111",
  scholar: "https://scholar.google.com/",
  resume: "/resume.pdf",
  location: "Materials / Machine Learning / DFT"
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" }
];

export const researchAreas = [
  {
    title: "高熵钠离子层状材料",
    summary:
      "关注多元素协同、层状结构稳定性、钠离子扩散路径和电化学性能之间的关系。",
    keywords: ["High-entropy", "Sodium-ion batteries", "Layered oxides"],
    href: "/research#high-entropy-layered-oxides",
    action: "查看高熵层状材料介绍"
  },
  {
    title: "机器学习材料筛选",
    summary:
      "利用描述符、结构特征和计算数据建立预测模型，帮助更快筛选候选材料。",
    keywords: ["Materials informatics", "Feature engineering", "Screening"],
    href: "/projects#machine-learning-screening",
    action: "进入筛选资料目录"
  },
  {
    title: "DFT 计算与机理分析",
    summary:
      "通过第一性原理计算分析形成能、电子结构、扩散势垒和相稳定性。",
    keywords: ["DFT", "VASP", "Electronic structure"],
    href: "/projects#dft-workflow",
    action: "查看 DFT 项目资料"
  }
];

export const skills = [
  "Python",
  "Materials Studio",
  "VASP",
  "pymatgen",
  "ASE",
  "scikit-learn",
  "Matplotlib",
  "Git",
  "Linux",
  "Astro"
];
