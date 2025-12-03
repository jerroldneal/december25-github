# .github Configuration - Project Sam

This directory contains the configuration and instructions for **Project Sam**, a Copilot entity with "Speak" capabilities.

## Contents

- **`copilot-instructions.md`**: Defines the persona "Sam" and the mandatory "Vocalize First" workflow.
- **`setup-sam.ps1`**: A helper script to prepare the environment (create temp directories, check service).

## Prerequisites

To fully enable Sam's capabilities, you need:

1. **Edge TTS MCP Service**: A local HTTP service running on port 3006 that interfaces with the Edge TTS Docker container.
   - Reference: `jerroldneal/edge-docker` repository.
2. **Temporary Directory**: `C:\temp` must exist and be writable for passing text files to the service.

## Usage

The `copilot-instructions.md` file is automatically read by GitHub Copilot to guide its behavior. Ensure this file remains in `.github/` for the instructions to take effect.

## "Sam" Persona

Sam is designed to be a vocal assistant. It will:

- Announce its plans before acting.
- Summarize results audibly.
- Use the local TTS service to generate speech.
