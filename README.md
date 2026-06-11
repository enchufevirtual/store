# Enchufe Virtual Store

Official product catalog for Enchufe Virtual.

A lightweight static storefront built with Next.js and deployed through GitHub Pages.

## Overview

Enchufe Virtual Store is designed to showcase technology products in a fast, simple, and accessible way.

Unlike a traditional ecommerce platform, this project focuses exclusively on product presentation, specifications, and product information. Customers can complete their purchases directly through WhatsApp.

The main goal of this project is to provide a lightweight, fast, and easy-to-maintain solution tailored to the needs of Enchufe Virtual.

## Features

* Static product catalog
* Integrated product search
* Individual product pages
* Responsive design for desktop and mobile devices
* Optimized for performance and speed
* Static Site Generation (SSG)
* WhatsApp integration for purchase inquiries
* JSON-based product management
* GitHub Pages deployment
* Custom domain support

## Technologies

* Next.js
* React
* TypeScript
* Node.js
* GitHub Pages

## Project Structure

```text
packages/
├── website/        # Main application
├── types/          # Shared types
```

Products, categories, and configuration data are managed through JSON files, making the project easy to maintain and update.

## Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## Deployment

This project is configured to be deployed as a static website using GitHub Pages.

Official website:

https://store.enchufevirtual.com

## Maintenance

This project is maintained by Enchufe Virtual.

All enhancements, bug fixes, optimizations, and customizations are managed and developed by the Enchufe Virtual team.

## Project Philosophy

This repository aims to provide a simple, fast, and maintainable storefront experience.

Several features from the original project were intentionally removed because they were not required for the current business model, including:

* Integrated checkout systems
* Payment processing
* Order management
* Enterprise ecommerce features
* Unused multilingual functionality
* Unnecessary dependencies and components

The result is a streamlined platform focused entirely on product discovery and customer contact through WhatsApp.

## Credits and Attribution

This project was originally derived from the open-source **Commerce Layer Demo Store Core** project, and it is now maintained by Enchufe Virtual as **Store Enchufe Virtual** (`store-ev`).

Special thanks to Commerce Layer for releasing and maintaining the original project under the MIT License, making it possible for developers and organizations to use, modify, distribute, and customize the software.

Original project:

https://github.com/commercelayer/demo-store-core

Commerce Layer:

https://commercelayer.io

## Project Status

This repository is currently maintained independently by Enchufe Virtual.

It is not officially affiliated with Commerce Layer and has been extensively modified to meet the specific requirements of Enchufe Virtual.

## License

This repository contains code derived from Commerce Layer Demo Store Core.

The original project is distributed under the MIT License.

All modifications and customizations made by Enchufe Virtual remain compatible with the terms of the MIT License.

Please refer to the LICENSE file for additional information.
