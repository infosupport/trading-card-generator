@echo off
rem Copy this file to "secrets.cmd" in the same folder and fill in the values.
rem secrets.cmd is git-ignored; never commit real keys.

set "ImageGeneration__Models__mai-image-flash__Endpoint=https://<your-foundry-resource>.services.ai.azure.com"
set "ImageGeneration__Models__mai-image-flash__ApiKey=<api-key>"

set "ImageGeneration__Models__gpt-image-1.5__Endpoint=https://<your-foundry-resource>.services.ai.azure.com"
set "ImageGeneration__Models__gpt-image-1.5__ApiKey=<api-key>"

rem Page opened in the kiosk browser: medieval, jurassic, isks, isks-8bit or sports
set "DEMO_PAGE=medieval"
