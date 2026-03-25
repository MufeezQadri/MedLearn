# MedLearn Mobile

Native Flutter source for MedLearn AI, adapted from the Stitch design language and aligned with the MedLearn product model already present in the web/API workspaces.

## What is included

- Editorial light theme inspired by the uploaded UI
- Native mobile shell with bottom navigation + drawer
- Login flow with demo student/admin accounts
- Dashboard, courses, modules, video/PDF viewer
- Book library
- Quiz hub, timed attempt screen, result analytics
- AI assistant chat
- Progress analytics
- Study planner
- Profile, settings, and admin screens

## Current limitation

The Flutter SDK was not installed in this environment, so the iOS/Android runner folders could not be generated or executed here. The Dart app source is ready, but the standard Flutter platform scaffolding still needs to be bootstrapped on a machine with Flutter installed.

## Bootstrap after installing Flutter

1. Install Flutter and confirm `flutter --version` works.
2. From `apps/mobile`, generate the missing platform runners if needed.
3. Run `flutter pub get`.
4. Launch with `flutter run`.

If this directory is missing `ios/` and `android/`, generate them with a local Flutter bootstrap step before the first run.
