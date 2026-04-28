---
title: "A great write-up on Web Component"
id: "350a97bc-458a-80b6-8f3a-db76d514b358"
layout: post
date: "2026-04-28T07:54:00.000Z"
---

A great article on why Web Components exist. This table the author created is really good:


|                                   | WebAssembly                                                                                | Linux                                                                                                                    | Windows                                                                                                              | macOS                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Instruction Format**            | [Core Wasm](https://webassembly.github.io/spec/core/)                                      | x86, ARM, etc.                                                                                                           | x86, ARM                                                                                                             | ARM                                                            |
| **Container Format**              | [Wasm Components](https://github.com/WebAssembly/component-model)                          | [Executable and Linkable Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) (ELF)                     | [Portable Executable](https://en.wikipedia.org/wiki/Portable_Executable) (PE)                                        | [Mach-O](https://en.wikipedia.org/wiki/Mach-O)                 |
| **Interface Definition Language** | [Wasm Interface Types](https://component-model.bytecodealliance.org/design/wit.html) (WIT) | C header files                                                                                                           | [Windows Metadata](https://learn.microsoft.com/en-us/uwp/winrt-cref/winmd-files) (WinMD)                             | (Objective-)C header files + Mach IDL + Swift Modules          |
| **System Interfaces**             | [Wasm System Interface](https://wasi.dev/) (WASI)                                          | [POSIX](https://en.wikipedia.org/wiki/POSIX) + [Linux User-Space APIs](https://docs.kernel.org/userspace-api/index.html) | [Win32](https://en.wikipedia.org/wiki/Windows_API) + [UWP](https://en.wikipedia.org/wiki/Universal_Windows_Platform) | [POSIX](https://en.wikipedia.org/wiki/POSIX) + Darwin Syscalls |


[https://blog.yoshuawuyts.com/why-webassembly-components](https://blog.yoshuawuyts.com/why-webassembly-components)


![Default caption](/assets/img/350a97bc-458a-8012-9bbe-ebcaf44e2a00.png)

