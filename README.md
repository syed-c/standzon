# README.md

Exhibition Stand Builder Platform — high-level AI-ready summary

A concise high-level summary to help an AI agent quickly assess the project’s purpose and capabilities, with emphasis on admin access in development mode and OTP-based verification flows.

## Project Essence

A platform for designing, validating, and launching exhibition stands, enabling builders and exhibitors to collaborate through a unified dashboard and verified profiles.

- Focuses on rapid design, collaboration, and production-ready exports.
- Purpose-built to connect exhibitors with builders via streamlined onboarding and verification.

## Key Capabilities (What the project does)

- Create and customize exhibition stand concepts with real-time previews.
- Facilitate multi-user collaboration on stand concepts.
- Manage builder and admin onboarding with email verification and OTP delivery.
- Support development-mode testing to validate OTP flows without external mail delivery.
- Provide a unified dashboard for managing profiles, verification status, and launches.

## Admin Access & Development Mode

- Admin login now mirrors builder/developer flows by displaying OTP on screen in development mode.
- Admin access uses the dedicated admin email: admin@exhibitbay.com.
- Development Mode features:
  - On-screen OTP visibility to enable rapid testing and UX validation.
  - Clear visual cues indicating Development Mode Active for admin access.
  - Safe, test-friendly flow that mirrors production logic without relying on live email delivery.

## OTP & Email Verification (Development Mode)

- OTP generation and verification flows are fixed and functional in development mode.
- Admin login now has the same development-mode OTP display as builder registration, facilitating on-screen testing and quick validation.
- Development-mode helpers provide visible OTPs to streamline testing without SMTP dependencies.

## Email Configuration Status (How to Test)

- Development mode provides a demo OTP workflow and visible testing helpers to validate the verification flow end-to-end.
- Documentation notes describe testing the registration and OTP flow, with emphasis on development-mode visibility for OTPs.

## Usage Snapshot (Essence)

- Users can create builder profiles, verify emails, and launch profiles for client discovery.
- Development-mode OTP visibility enables rapid testing and iteration.
- The platform emphasizes a smooth, unified onboarding and verification experience for builders and admins.

## Recent Fixes and Improvements

- Admin login OTP issue fixed with development-mode on-screen display.
- Development-mode OTP visibility added to streamline admin and builder testing.
- Email configuration testing aided by development-mode helpers and guidance.
- Documentation reflects the current OTP/development verification status for admin and builder flows.

## Notes

- This README serves as a high-level summary for AI agents and engineers to quickly assess relevance and next steps.
- It highlights the development-mode OTP display improvements for admin access and builder registration.