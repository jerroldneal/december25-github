# Developer's Guide

This document provides technical details for developers working on the Airport Union App. It covers the current architecture, design decisions, and the roadmap for moving from a prototype to a production-ready application.

## Architecture Overview

The current version is a **Frontend-Only Prototype**. It simulates backend interactions using local state and `AsyncStorage`.

- **Platform**: React Native (Expo Managed Workflow).
- **State Management**: React `useState` and `useEffect` hooks.
- **Persistence**: `@react-native-async-storage/async-storage` is used to persist user sessions locally.
- **Navigation**: `@react-navigation/stack` handles screen transitions.

### Key Assumptions
1.  **Privacy First**: The concept relies on "secret" coordination. Future backend implementations must prioritize end-to-end encryption.
2.  **Minimal Scope**: The current build focuses on UI/UX flow without complex backend integration.

## Component Breakdown

### Screens

1.  **`LoginScreen.js`**
    - Handles user input for username/password.
    - **Current Logic**: Stores the username in `AsyncStorage` upon "login". No real authentication validation is performed.
    - **Future**: Integrate with an auth provider (Firebase Auth, Auth0).

2.  **`DashboardScreen.js`**
    - The main hub. Displays queue data and the polling widget.
    - **Data Source**: Hardcoded mock data array `queueData`.
    - **Future**: Fetch real-time queue data from a WebSocket or REST API.

3.  **`ChatScreen.js`**
    - A simple list of messages.
    - **Current Logic**: Appends new messages to a local array state. Messages are lost on app reload (unless persisted).
    - **Future**: Implement a real-time chat service (Socket.io, Firestore) with encryption.

### Components

-   **`PollComponent.js`**
    -   A reusable widget for binary voting (Yes/No).
    -   **State**: Manages local vote state and mock result counts.

## Data Flow

1.  **Authentication**: User enters ID -> Saved to Local Storage -> Navigate to Dashboard.
2.  **Dashboard Load**: Component mounts -> Reads User from Storage -> Displays User Name.
3.  **Messaging**: User types message -> State Updates -> List Re-renders.

## Roadmap to Production

To transition this prototype to a real-world application, the following steps are required:

### 1. Backend Integration
-   **Authentication**: Replace mock login with a secure service. Ensure driver verification (e.g., upload license/ID).
-   **Database**: Use a real-time database (Firebase Firestore or Supabase) to sync queue positions and poll results across devices.
-   **API**: Create endpoints for:
    -   `GET /queue/:airportId`
    -   `POST /queue/update`
    -   `POST /vote`

### 2. Real-Time Communication
-   Implement **WebSockets** (e.g., Socket.io) for the Chat Screen and live Queue updates.
-   Ensure low latency for "secret" coordination during surges.

### 3. Security & Privacy
-   **Encryption**: Implement end-to-end encryption for the chat feature.
-   **Anonymity**: Ensure user IDs are hashed or randomized in public views to protect drivers from platform retaliation.
-   **Geofencing**: Restrict queue features to specific GPS coordinates (airport lots).

### 4. Testing
-   **Unit Tests**: Add Jest tests for components and logic.
-   **E2E Tests**: Use Detox or Maestro for end-to-end testing flows.

## Contribution Guidelines

1.  Follow the existing folder structure.
2.  Keep components functional and stateless where possible.
3.  Use `StyleSheet.create` for styling to ensure performance.

## Android ADB Setup on Windows

To run the app on a physical Android device via USB debugging, follow these steps:

### 1. Enable Developer Options on your Phone
1.  Go to **Settings** > **About Phone**.
2.  Tap **Build Number** 7 times until you see "You are now a developer!".
3.  Go back to **Settings** > **System** > **Developer Options**.
4.  Enable **USB Debugging**.

### 2. Install Drivers on Windows
1.  Connect your phone to your PC via USB.
2.  Windows might install drivers automatically. If not, download the [Google USB Driver](https://developer.android.com/studio/run/win-usb) or the specific driver for your manufacturer (Samsung, etc.).
3.  Open **Device Manager** and ensure your device shows up under "Portable Devices" or "ADB Interface" without errors.

### 3. Verify ADB Connection
1.  Open a terminal (Command Prompt or PowerShell).
2.  Run:
    ```bash
    adb devices
    ```
3.  You should see your device ID listed.
    -   If it says `unauthorized`, check your phone screen and allow the USB debugging prompt.

### 4. Run the App
1.  In your project folder, run:
    ```bash
    npx expo start --android
    ```
2.  This will install the Expo Go app on your device and launch the project.
