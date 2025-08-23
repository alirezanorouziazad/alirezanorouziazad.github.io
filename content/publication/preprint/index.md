---
title: "Optimized DeepLabV3+ for Clinical Data Analysis through Advanced Particle Swarm Optimization‐Based Channel Selection"
authors:
- Alireza Norouziazad, Et al.
date: "2025-07-13T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-07-13T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article"]

# Publication name and optional abbreviated publication name.
publication: "Wiley, Advanced Intelligent Systems"
publication_short: ""

abstract: Medical image analysis of complex neurological diseases, such as brain tumors and Alzheimer's disease, is challenging due to subtle pathological features. Traditional deep learning models often extract redundant features that hinder segmentation accuracy. To address this limitation, a novel machine-learning framework is proposed that combines an Extended Exploration Particle Swarm Optimization (EE-PSO) algorithm with a modified DeepLabV3+ architecture to enhance feature selection and improve segmentation performance in medical imaging tasks. The two main contributions are 1) a structurally optimized DeepLabV3+ model that uses dynamic EE-PSO-driven channels instead of standard convolutional layers to adaptively prioritize important features during training, and 2) an improved PSO algorithm that incorporates particle reinitialization and adaptive inertia weight adjustment to reduce premature convergence and enhance global search capabilities. The atrous spatial pyramid pooling module has the EE-PSO component strategically incorporated inside it, allowing for the synergistic integration of multi-scale contextual information with optimal feature maps. The system demonstrates improvements in mean intersection over union (mIOU) of 2.7% and 2.8% when tested on Alzheimer's and brain tumor datasets. Through the integration of deep feature learning, this study improves the precision-autonomy trade-off in medical image analysis.

# Summary. An optional shortened abstract.
summary: A novel framework combining EE-PSO and modified DeepLabV3+ improves feature selection and segmentation of neurological disease images. Integrating multi-scale contextual information, it enhances mean IoU by 2.7–2.8% on Alzheimer’s and brain tumor datasets, boosting precision and autonomy in medical image analysis.

tags:
- Computer Vision

featured: true

# hugoblox:
#   ids:
#     arxiv: 1512.04133v1

links:
# - type: published
#   provider: Wiley
#   id: 1512.04133v1
- type: code
  url: https://doi.org/10.1002/aisy.202500282
# - type: slides
#   url: https://doi.org/10.1002/aisy.202500282
# - type: dataset
#   url: "#"
# - type: Journal paper
#   url: "#"
- type: source
  url: https://advanced.onlinelibrary.wiley.com/doi/10.1002/aisy.202500282
# - type: video
#   url: "#"
# - type: custom
#   label: Custom Link
#   url: http://example.org

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'A novel medical image segmentation framework that integrates an enhanced Particle Swarm Optimization (EE-PSO) into DeepLabV3+ to optimize feature selection. By dynamically identifying key channels in the atrous spatial pyramid pooling module, the method improves segmentation performance, achieving mIoU gains of 2.7% on Alzheimer''s and 2.8% on brain tumor datasets, effectively enhancing precision, robustness, and detection of subtle pathological features.'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
- internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---
<!-- 
This work is driven by the results in my [previous paper](/publication/conference-paper/) on LLMs. -->

<!-- {{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://docs.hugoblox.com/content/writing-markdown-latex/). -->
