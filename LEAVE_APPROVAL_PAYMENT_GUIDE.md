# Leave Approval Payment System - Implementation Guide

## Overview
The military website now includes a **Leave Approval Payment** system that must be completed after a leave request is approved but before the soldier can book their military flight.

## Payment Workflow

### Step 1: Apply for Leave
- User navigates to `/leave` page
- Selects leave type (Emergency, Vacation, or Medical)
- Fills in soldier details, dates, and reason
- Submits the leave request
- **Status**: `pending` | **Payment Status**: `not_required`

### Step 2: Await Approval
- Military administration reviews the leave request
- Admin updates the status to `approved` in the system
- When approved, **Payment Status** automatically changes to `pending`
- User sees "Payment Pending" badge on their leave request

### Step 3: Pay Leave Approval Fee (NEW)
- User sees approved leave requests with "Pay Approval Fee" button
- Clicks the button which redirects to `/leave-approval-payment/[id]`
- On the payment page, user sees:
  - Leave details (soldier name, type, dates)
  - Approval processing fee: **$250** (default, configurable)
  - Platform fee: 2% of approval fee
  - Total amount due
- User enters:
  - Full name
  - Email address
  - Payment method (Credit Card or Bank Transfer)
  - Card details (if card selected)
  - Billing address
- Clicks "Pay" button
- Payment is processed (simulated 2-second delay)
- Payment status updates to `completed`
- User redirected back to Leave page

### Step 4: Book Military Flight & Pay Flight Fee
- Only available AFTER approval payment is completed
- User navigates to `/payments` page
- Sees only leaves with `paymentStatus: 'completed'`
- Can now proceed with flight booking and payment
- Pays for the actual military flight fee

## Database Schema Updates

### LeaveRequest Interface
```typescript
interface LeaveRequest {
  id: string;
  type: 'emergency' | 'vacation' | 'medical';
  soldierName: string;
  soldierRank: string;
  soldierID: string;
  relationshipToSoldier: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'not_required' | 'pending' | 'completed'; // NEW FIELD
  submittedAt: string;
}
```

## Component Structure

### New Routes
- `/leave-approval-payment/[id]` - Dedicated page for approval fee payment

### Updated Routes
- `/leave` - Updated to show payment status badges and "Pay Approval Fee" button
- `/dashboard` - Added payment workflow section (4-step process visualization)
- `/payments` - Updated with workflow info and requirements

## User-Facing Changes

### Dashboard
- Added 4-step workflow visualization showing the complete leave process
- Added "Leave Approval Payment" card explaining the process

### Leave Page
- Added payment status badges:
  - "Payment Pending" (purple) - when approved but payment not done
  - "Payment Done" (emerald) - when payment completed
- Added "Pay Approval Fee" button on approved leaves with pending payment

### Leave Approval Payment Page
- New dedicated page for processing approval fees
- Shows all leave details
- Displays fee breakdown (approval fee + platform fee)
- Collects personal info (name, email)
- Supports multiple payment methods
- Secure form with validation

### Payments Page
- Added workflow information banner explaining the 3-step process
- Clarifies that approval payment must be completed first

## Features

✓ **Payment Status Tracking**: Prevents access to flight booking until approval is paid
✓ **Clear Visual Indicators**: Badges show payment progress
✓ **Secure Payment Form**: Collects all necessary payment information
✓ **Fee Transparency**: Shows approval fee, platform fee, and total
✓ **User Guidance**: Dashboard and page descriptions guide users through the workflow
✓ **Data Persistence**: Uses localStorage to track payment status
✓ **Responsive Design**: Works on mobile and desktop

## Default Values

- **Approval Processing Fee**: $250
- **Platform Fee**: 2% of approval fee
- **Payment Methods**: Credit/Debit Card, Bank Transfer
- **Data Storage**: localStorage (militaryAuth, leaveRequests)

## Testing Checklist

- [ ] Apply for leave and verify status is 'pending'
- [ ] Update leave status to 'approved' in localStorage
- [ ] Verify "Payment Pending" badge appears
- [ ] Click "Pay Approval Fee" button
- [ ] Fill in payment form with valid data
- [ ] Submit payment and verify success message
- [ ] Verify payment status changes to 'completed'
- [ ] Navigate to payments page and verify leave is available
- [ ] Confirm workflow info displays on all relevant pages

## Future Enhancement Opportunities

1. Real database integration (Supabase, Neon, etc.)
2. Real payment gateway integration (Stripe, PayPal)
3. Email notifications for payment confirmation
4. Admin panel to manually approve leaves
5. Payment receipt generation
6. Refund processing system
7. Multiple currency support
8. Automated payment reminders
