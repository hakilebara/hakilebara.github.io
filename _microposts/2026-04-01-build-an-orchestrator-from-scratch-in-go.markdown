---
title: "Build an Orchestrator From Scratch in Go"
id: "335a97bc-458a-80b6-ace1-e37bfb73a7c0"
layout: post
date: "2026-04-01T12:17:00.000Z"
---

I just finished building “[Cube](https://github.com/hakilebara/cube)”, a Docker workload orchestrator written from scratch in Go. Orchestrators are the cornerstone of cloud computing. They automate the deployment, scheduling, and scaling of computing tasks (containers) across a cluster of machines. Every professional Web application you use today almost certainly relies on an orchestrator.

The most famous (and complex) orchestrator is [Kubernetes](https://en.wikipedia.org/wiki/Kubernetes). Cube of course goes nowhere near the level of complexity of k8s. Still, Cube made me understand the fundamental building blocks behind such software (Managers, Workers, Schedulers, Scheduling algorithms, Storage, basic Telemetry etc.)



![Default caption](/assets/img/335a97bc-458a-80d3-b27a-ef88c180635b.png)



To write Cube, I went through [the book ](https://www.manning.com/books/build-an-orchestrator-in-go-from-scratch)of Tim Boring cover to cover. The book is a great read, even though quite a few bugs slipped through the cracks and fixing them was left as an exercise to the reader. All-in-all it turned out to be a great way to learn.


Here is the repository: [https://github.com/hakilebara/cube](https://github.com/hakilebara/cube)


![Default caption](/assets/img/335a97bc-458a-800e-be4a-ece1cf23e961.png)

