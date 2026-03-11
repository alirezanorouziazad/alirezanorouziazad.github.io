---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      username: admin
      text: ""
      button:
        text: Download CV
        url: uploads/resume.pdf
    design:
      css_class: dark
      avatar:
        size: xxl
        shape: circle
      background:
        color: black
        image:
          filename: hero-gradient.svg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  - block: markdown
    content:
      title: '🔬 My Research'
      subtitle: ''
      text: |-
        I focus on developing AI-driven solutions for **medical image analysis** and **healthcare innovation**. My work integrates deep learning, computer vision, and optimization algorithms to enable early and accurate disease detection.

        Currently pursuing my **Ph.D. at York University**, I am passionate about translating cutting-edge research into practical clinical applications, with a special interest in **wearable biosensors** and **automated diagnostic suites**.
        
        *Let's connect and explore opportunities to collaborate!* 🚀
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      page_type: post
      count: 5
      filters:
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      offset: 0
      order: desc
    design:
      view: date-title-summary
      spacing:
        padding: [0, 0, 0, 0]
---
