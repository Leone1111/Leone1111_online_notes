---
title: "DFT 计算任务整理与自动化脚本"
description: "用于整理 VASP 输入输出、提取关键结果、生成计算记录表格的脚本项目。"
date: 2026-05-16
status: "Code Project"
tags: ["VASP", "Python", "Automation", "Research Tools"]
github: "https://github.com/Leone1111"
download: "https://onedrive.live.com/"
featured: true
---

## 项目简介

DFT 计算经常会产生大量目录和输出文件。如果手动检查每个任务，效率低，也容易漏掉异常计算。

这个项目计划用 Python 脚本整理常见输出，例如收敛状态、最终能量、结构变化、磁矩和关键参数。

## 技术路线

- 使用 Python 遍历计算目录。
- 读取 VASP 输出文件。
- 汇总任务状态和关键数值。
- 输出 CSV 或 Markdown 表格。
- 将异常任务标记出来，方便重新计算。

## 项目亮点

- 服务真实科研流程，不是孤立的小脚本。
- 输出结果可以直接放进博客、项目页面或组会材料。
- 后续可以接入 `pymatgen` 和 `ASE` 做更完整的结构分析。
