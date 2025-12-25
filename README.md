# Airport Union App

A minimal mobile application designed to help rideshare drivers coordinate on airport queue management and pricing strategies. This app empowers drivers by allowing them to share real-time queue info, discuss strategies anonymously, and vote on minimum pricing thresholds.

## Features

- **Driver Login**: Simple authentication to ensure community integrity.
- **Queue Dashboard**: View shared queue status and estimated wait times at airports.
- **Union Pricing Polls**: Collective voting on minimum fare thresholds.
- **Secret Discussion**: Anonymous chat for drivers to coordinate without platform oversight.

## Tech Stack

- **Framework**: React Native (via Expo)
- **Navigation**: React Navigation (Stack)
- **Storage**: AsyncStorage (Local persistence)
- **UI**: React Native Core Components

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Expo Go app on your mobile device (iOS/Android) or an emulator.

### Installation

1.  Clone the repository (or navigate to the project folder):
    ```bash
    cd AirportUnionApp
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npx expo start
    ```

4.  Scan the QR code with the Expo Go app or press `a` for Android emulator / `i` for iOS simulator.

## Project Structure

```
AirportUnionApp/
├── App.js                # Application entry point and navigation setup
├── screens/              # Screen components
│   ├── LoginScreen.js    # Authentication screen
│   ├── DashboardScreen.js # Main dashboard with queue info
│   └── ChatScreen.js     # Anonymous chat interface
├── components/           # Reusable UI components
│   └── PollComponent.js  # Voting/Polling widget
└── assets/               # Static assets
```

## Disclaimer

This is a proof-of-concept application. Current implementation uses mock data and local storage. It is not connected to a live backend service.
