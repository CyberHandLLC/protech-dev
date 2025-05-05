# Twilio SMS Integration for ProTech HVAC Contact Forms

This document outlines the implementation of Twilio SMS notifications for the ProTech HVAC website contact forms.

## Overview

When users submit either the main contact form or the quick contact form in the hero section, their information is sent to your phone via SMS using the Twilio API. This allows you to receive instant notifications for new customer inquiries.

## Required Environment Variables

The following environment variables need to be set in your Vercel deployment:

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Your Twilio account SID (found in your Twilio dashboard) |
| `TWILIO_AUTH_TOKEN` | Your Twilio auth token (found in your Twilio dashboard) |
| `TWILIO_PHONE_NUMBER` | The Twilio phone number to send SMS from (must be purchased through Twilio) |
| `OWNER_PHONE_NUMBER` | Your phone number where you want to receive SMS notifications |

## How to Obtain Twilio Credentials

1. **Create a Twilio Account**:
   - Sign up at [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
   - Verify your email address and phone number

2. **Get Your Account SID and Auth Token**:
   - Log in to the [Twilio Console](https://www.twilio.com/console)
   - Your Account SID and Auth Token are displayed on the dashboard

3. **Purchase a Twilio Phone Number**:
   - In the Twilio Console, navigate to Phone Numbers > Buy a Number
   - Select a number that has SMS capabilities
   - Complete the purchase process

## Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the required variables listed above
4. Make sure to add them to all environments (Production, Preview, Development)
5. Click Save

## Implementation Details

### API Endpoint

A new API route has been created at `src/app/api/contact/route.ts` that:
- Receives form data from both contact forms
- Validates required fields
- Formats the message with all form data
- Sends the SMS via Twilio
- Returns appropriate success/error responses

### Contact Forms

Both contact forms have been updated to:
- Send data to the new API endpoint
- Include a source identifier to distinguish between forms
- Handle success and error responses
- Provide appropriate feedback to users

## Testing the Integration

To test the integration locally:

1. Create a `.env.local` file in the project root with your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   OWNER_PHONE_NUMBER=your_phone_number
   ```

2. Restart the development server
3. Submit a test message through either contact form
4. You should receive an SMS notification on your phone

## Troubleshooting

If SMS messages are not being received:

1. Check Vercel logs for any API errors
2. Verify that all environment variables are correctly set
3. Ensure your Twilio account has sufficient credit
4. Check that the phone number has SMS capabilities enabled
5. Verify that the formatting of your phone numbers includes country code (e.g., +1 for US numbers)

## Costs

Twilio charges per message sent. Current pricing can be found at [Twilio's Pricing Page](https://www.twilio.com/sms/pricing).
