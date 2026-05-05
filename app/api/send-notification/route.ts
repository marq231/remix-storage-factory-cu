import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'Ltcol.defence@gmail.com';
const SENDER_EMAIL = 'D4 Battalion Squad <military@d4battalion.us>';

interface NotificationPayload {
  type: 'leave_request' | 'approval_payment' | 'flight_payment' | 'flight_booking' | 'care_package' | 'payment_confirmation' | 'flight_payment_confirmation' | 'leave_approved' | 'leave_rejected' | 'payment_awaiting' | 'payment_approved' | 'payment_rejected';
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  console.log('[v0] === NOTIFICATION API CALLED ===');
  try {
    const payload: NotificationPayload = await request.json();
    console.log('[v0] Payload type:', payload.type);
    console.log('[v0] Payload data:', JSON.stringify(payload.data, null, 2));
    
    // Generate email content based on notification type
    const { adminEmail, clientEmail } = generateEmailContent(payload);
    console.log('[v0] Generated admin email subject:', adminEmail?.subject);
    console.log('[v0] Generated client email subject:', clientEmail?.subject);
    
    const results = {
      adminEmailSent: false,
      clientEmailSent: false,
      errors: [] as string[],
    };

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.log('[v0] RESEND_API_KEY not configured - emails will be logged only');
      results.errors.push('RESEND_API_KEY not configured');
    } else {
      // Dynamically import Resend
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      
      // Send admin notification
      if (adminEmail) {
        try {
          const result = await resend.emails.send({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: adminEmail.subject,
            html: adminEmail.html,
          });
          console.log('[v0] Admin email result:', result);
          results.adminEmailSent = true;
        } catch (emailError: any) {
          console.error('[v0] Failed to send admin email:', emailError);
          results.errors.push(`Admin email error: ${emailError.message}`);
        }
      }

      // Send client notification
      const clientEmailAddress = payload.data.applicant_email || payload.data.email || payload.data.sender_email;
      if (clientEmail && clientEmailAddress) {
        try {
          const result = await resend.emails.send({
            from: SENDER_EMAIL,
            to: String(clientEmailAddress),
            subject: clientEmail.subject,
            html: clientEmail.html,
          });
          console.log('[v0] Client email result:', result);
          results.clientEmailSent = true;
        } catch (emailError: any) {
          console.error('[v0] Failed to send client email:', emailError);
          results.errors.push(`Client email error: ${emailError.message}`);
        }
      }
    }
    
    // Always log the notification for debugging
    console.log('=== NOTIFICATION ===');
    console.log('Type:', payload.type);
    console.log('Admin Email:', ADMIN_EMAIL);
    console.log('Client Email:', payload.data.applicant_email || payload.data.email);
    console.log('Admin Subject:', adminEmail?.subject);
    console.log('Client Subject:', clientEmail?.subject);
    console.log('Results:', results);
    console.log('====================');
    
    return NextResponse.json({
      success: true,
      message: 'Notification processed',
      results,
    });
  } catch (error: any) {
    console.error('[v0] Error in notification API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

function generateEmailContent(payload: NotificationPayload): { 
  adminEmail: { subject: string; html: string } | null; 
  clientEmail: { subject: string; html: string } | null;
} {
  const { type, data } = payload;
  
  const emailStyles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #1c2a1f; color: #c9a227; padding: 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { background: #f8f8f8; padding: 20px; }
      .section { margin-bottom: 20px; }
      .section h3 { color: #1c2a1f; border-bottom: 2px solid #c9a227; padding-bottom: 5px; }
      .label { font-weight: bold; color: #555; }
      .highlight { background: #c9a227; color: #1c2a1f; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 15px 0; }
      .footer { background: #1c2a1f; color: #a8a89a; padding: 15px; text-align: center; font-size: 12px; }
      .approved { background: #22c55e; color: white; }
      .rejected { background: #ef4444; color: white; }
      .pending { background: #eab308; color: #1c2a1f; }
    </style>
  `;
  
  switch (type) {
    case 'leave_request':
      return {
        adminEmail: {
          subject: `[NEW LEAVE REQUEST] ${data.type} - ${data.soldier_name} - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>New Leave Request Submitted</p>
              </div>
              <div class="content">
                <div class="highlight">Tracking Code: ${data.tracking_code}</div>
                
                <div class="section">
                  <h3>Leave Details</h3>
                  <p><span class="label">Leave Type:</span> ${String(data.type).toUpperCase()}</p>
                  <p><span class="label">Duration Package:</span> ${data.duration_package}</p>
                  <p><span class="label">Leave Amount:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                  <p><span class="label">Dates:</span> ${data.start_date} to ${data.end_date}</p>
                  <p><span class="label">Reason:</span> ${data.reason}</p>
                </div>
                
                <div class="section">
                  <h3>Soldier Information</h3>
                  <p><span class="label">Name:</span> ${data.soldier_name}</p>
                  <p><span class="label">Rank:</span> ${data.soldier_rank}</p>
                  <p><span class="label">Military ID:</span> ${data.soldier_id}</p>
                </div>
                
                <div class="section">
                  <h3>Applicant Information</h3>
                  <p><span class="label">Name:</span> ${data.applicant_name}</p>
                  <p><span class="label">Email:</span> ${data.applicant_email}</p>
                  <p><span class="label">Phone:</span> ${data.applicant_phone || 'N/A'}</p>
                  <p><span class="label">Relationship:</span> ${data.relationship_to_soldier}</p>
                </div>
                
                <p style="text-align: center;"><em>Submitted: ${new Date().toLocaleString()}</em></p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
                <p>Please review this request in the Admin Dashboard.</p>
              </div>
            </div>
          `,
        },
        clientEmail: {
          subject: `Leave Request Submitted - Your Tracking Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>Leave Request Confirmation</p>
              </div>
              <div class="content">
                <p>Dear ${data.applicant_name},</p>
                <p>Your leave request has been successfully submitted and is now pending review.</p>
                
                <div class="highlight">Your Tracking Code: ${data.tracking_code}</div>
                <p style="text-align: center;"><strong>IMPORTANT: Save this code to track your application status!</strong></p>
                
                <div class="section">
                  <h3>Request Summary</h3>
                  <p><span class="label">Leave Type:</span> ${String(data.type).toUpperCase()}</p>
                  <p><span class="label">Soldier:</span> ${data.soldier_name} (${data.soldier_rank})</p>
                  <p><span class="label">Duration:</span> ${data.start_date} to ${data.end_date}</p>
                  <p><span class="label">Amount:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                </div>
                
                <div class="section">
                  <h3>Next Steps</h3>
                  <ol>
                    <li>Wait for your leave to be reviewed and approved</li>
                    <li>Once approved, complete the leave payment</li>
                    <li>After payment, you can book your flight</li>
                  </ol>
                </div>
                
                <p>You will receive email notifications for any updates to your application.</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
                <p>Contact: Ltcol.defence@gmail.com | +1 (430) 291-3433</p>
              </div>
            </div>
          `,
        },
      };

    case 'leave_approved':
      return {
        adminEmail: null,
        clientEmail: {
          subject: `APPROVED: Your Leave Request - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header" style="background: #166534;">
                <h1>D4 Battalion Squad</h1>
                <p>Leave Request Update</p>
              </div>
              <div class="content">
                <div class="highlight approved">YOUR LEAVE HAS BEEN APPROVED!</div>
                
                <p>Dear ${data.applicant_name},</p>
                <p>Great news! Your leave request for <strong>${data.soldier_name}</strong> has been approved.</p>
                
                <div class="section">
                  <h3>Leave Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Leave Type:</span> ${String(data.type).toUpperCase()}</p>
                  <p><span class="label">Duration:</span> ${data.start_date} to ${data.end_date}</p>
                  <p><span class="label">Amount Due:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                </div>
                
                <div class="section">
                  <h3>Next Steps</h3>
                  <ol>
                    <li>Visit the portal and use your tracking code: <strong>${data.tracking_code}</strong></li>
                    <li>Complete the payment via bank transfer</li>
                    <li>Click "Yes, I have paid" to notify admin</li>
                    <li>Once payment is verified, you can book your flight</li>
                  </ol>
                </div>
                
                <p><strong>Payment Instructions:</strong> Contact admin for bank details at Ltcol.defence@gmail.com</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };

    case 'leave_rejected':
      return {
        adminEmail: null,
        clientEmail: {
          subject: `REJECTED: Your Leave Request - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header" style="background: #991b1b;">
                <h1>D4 Battalion Squad</h1>
                <p>Leave Request Update</p>
              </div>
              <div class="content">
                <div class="highlight rejected">YOUR LEAVE REQUEST HAS BEEN REJECTED</div>
                
                <p>Dear ${data.applicant_name},</p>
                <p>We regret to inform you that your leave request for <strong>${data.soldier_name}</strong> has been rejected.</p>
                
                <div class="section">
                  <h3>Request Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Leave Type:</span> ${String(data.type).toUpperCase()}</p>
                </div>
                
                <p>If you have questions, please contact us at Ltcol.defence@gmail.com or +1 (430) 291-3433.</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };

    case 'payment_confirmation':
      return {
        adminEmail: {
          subject: `[PAYMENT ${data.payment_confirmed ? 'CONFIRMED' : 'NOT CONFIRMED'}] ${data.soldier_name} - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header" style="background: ${data.payment_confirmed ? '#166534' : '#991b1b'};">
                <h1>D4 Battalion Squad</h1>
                <p>Leave Payment Status Update</p>
              </div>
              <div class="content">
                <div class="highlight" style="background: ${data.payment_confirmed ? '#22c55e' : '#ef4444'}; color: white;">
                  ${data.payment_confirmed ? 'CLIENT SAYS: PAYMENT MADE' : 'CLIENT SAYS: PAYMENT NOT YET MADE'}
                </div>
                
                <div class="section">
                  <h3>Request Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Soldier Name:</span> ${data.soldier_name}</p>
                  <p><span class="label">Applicant:</span> ${data.applicant_name}</p>
                  <p><span class="label">Email:</span> ${data.applicant_email}</p>
                  <p><span class="label">Leave Amount:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                </div>
                
                <p style="text-align: center;"><em>Notification received: ${new Date().toLocaleString()}</em></p>
                
                ${data.payment_confirmed ? '<p style="text-align: center; color: #166534; font-weight: bold;">Please verify the payment in your bank account and update the status in the Admin Dashboard.</p>' : ''}
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
        clientEmail: null,
      };

    case 'flight_payment_confirmation':
      return {
        adminEmail: {
          subject: `[FLIGHT PAYMENT ${data.payment_confirmed ? 'CONFIRMED' : 'PENDING'}] ${data.soldier_name} - ${data.flight_class}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header" style="background: ${data.payment_confirmed ? '#166534' : '#ca8a04'};">
                <h1>D4 Battalion Squad</h1>
                <p>Flight Payment Status Update</p>
              </div>
              <div class="content">
                <div class="highlight" style="background: ${data.payment_confirmed ? '#22c55e' : '#eab308'}; color: ${data.payment_confirmed ? 'white' : '#1c2a1f'};">
                  ${data.payment_confirmed ? 'CLIENT SAYS: FLIGHT PAYMENT MADE' : 'CLIENT SAYS: PAYMENT PENDING'}
                </div>
                
                <div class="section">
                  <h3>Booking Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Soldier Name:</span> ${data.soldier_name}</p>
                  <p><span class="label">Flight Class:</span> ${data.flight_class}</p>
                  <p><span class="label">Total Amount:</span> $${Number(data.total_amount).toLocaleString()}</p>
                  <p><span class="label">Route:</span> ${data.departure_location} to ${data.arrival_location}</p>
                </div>
                
                <div class="section">
                  <h3>Contact</h3>
                  <p><span class="label">Applicant:</span> ${data.applicant_name}</p>
                  <p><span class="label">Email:</span> ${data.applicant_email}</p>
                </div>
                
                <p style="text-align: center;"><em>Notification received: ${new Date().toLocaleString()}</em></p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
        clientEmail: null,
      };

    case 'flight_booking':
      return {
        adminEmail: {
          subject: `[NEW FLIGHT BOOKING] ${data.flight_class} - ${data.soldier_name} - $${Number(data.total_amount).toLocaleString()}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>New Flight Booking Submitted</p>
              </div>
              <div class="content">
                <div class="section">
                  <h3>Flight Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Flight Class:</span> ${data.flight_class}</p>
                  <p><span class="label">From:</span> ${data.departure_location}</p>
                  <p><span class="label">To:</span> ${data.arrival_location}</p>
                  <p><span class="label">Date:</span> ${data.departure_date}</p>
                </div>
                
                <div class="section">
                  <h3>Payment Details</h3>
                  <p><span class="label">Flight Amount:</span> $${Number(data.flight_amount).toLocaleString()}</p>
                  <p><span class="label">Platform Fee:</span> $${Number(data.platform_fee).toLocaleString()}</p>
                  <p><span class="label">Total:</span> $${Number(data.total_amount).toLocaleString()}</p>
                  <p><span class="label">Payment Method:</span> Bank Transfer</p>
                </div>
                
                <div class="section">
                  <h3>Passenger Information</h3>
                  <p><span class="label">Soldier Name:</span> ${data.soldier_name}</p>
                  <p><span class="label">Applicant:</span> ${data.applicant_name}</p>
                  <p><span class="label">Email:</span> ${data.applicant_email}</p>
                </div>
                
                <p style="text-align: center;"><em>Submitted: ${new Date().toLocaleString()}</em></p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
        clientEmail: {
          subject: `Flight Booking Submitted - ${data.flight_class} - Tracking: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>Flight Booking Confirmation</p>
              </div>
              <div class="content">
                <p>Dear ${data.applicant_name},</p>
                <p>Your flight booking has been submitted successfully.</p>
                
                <div class="section">
                  <h3>Flight Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Flight Class:</span> ${data.flight_class}</p>
                  <p><span class="label">From:</span> ${data.departure_location}</p>
                  <p><span class="label">To:</span> ${data.arrival_location}</p>
                  <p><span class="label">Date:</span> ${data.departure_date}</p>
                  <p><span class="label">Total Amount:</span> $${Number(data.total_amount).toLocaleString()}</p>
                </div>
                
                <div class="section">
                  <h3>Payment Instructions</h3>
                  <p>Please complete payment via bank transfer and confirm in the portal.</p>
                  <p>Contact admin for bank details: Ltcol.defence@gmail.com</p>
                </div>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };
      
    case 'care_package':
      return {
        adminEmail: {
          subject: `[NEW CARE PACKAGE] To: ${data.recipient_name} (${data.recipient_rank})`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>New Care Package Order</p>
              </div>
              <div class="content">
                <div class="section">
                  <h3>Sender Information</h3>
                  <p><span class="label">Name:</span> ${data.sender_name}</p>
                  <p><span class="label">Email:</span> ${data.sender_email}</p>
                  <p><span class="label">Phone:</span> ${data.sender_phone || 'N/A'}</p>
                </div>
                
                <div class="section">
                  <h3>Recipient Information</h3>
                  <p><span class="label">Name:</span> ${data.recipient_name}</p>
                  <p><span class="label">Rank:</span> ${data.recipient_rank}</p>
                  <p><span class="label">Unit:</span> ${data.recipient_unit}</p>
                  <p><span class="label">Base:</span> ${data.recipient_base}</p>
                </div>
                
                <div class="section">
                  <h3>Package Details</h3>
                  <p><span class="label">Items:</span> ${Array.isArray(data.items) ? data.items.join(', ') : data.items}</p>
                  <p><span class="label">Message:</span> ${data.message || 'N/A'}</p>
                  <p><span class="label">Estimated Weight:</span> ${data.estimated_weight} lbs</p>
                  <p><span class="label">Shipping Cost:</span> $${Number(data.shipping_cost).toFixed(2)}</p>
                </div>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
        clientEmail: {
          subject: `Care Package Order Confirmed - To: ${data.recipient_name}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>Care Package Order Confirmation</p>
              </div>
              <div class="content">
                <p>Dear ${data.sender_name},</p>
                <p>Your care package order has been received and is being processed.</p>
                
                <div class="section">
                  <h3>Recipient</h3>
                  <p>${data.recipient_name} (${data.recipient_rank})</p>
                  <p>${data.recipient_unit}, ${data.recipient_base}</p>
                </div>
                
                <div class="section">
                  <h3>Package Contents</h3>
                  <p>${Array.isArray(data.items) ? data.items.join(', ') : data.items}</p>
                </div>
                
                <p>You will receive updates on your package status.</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };

    case 'payment_approved':
      return {
        adminEmail: null,
        clientEmail: {
          subject: `PAYMENT VERIFIED - Your Leave Request - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header">
                <h1>D4 Battalion Squad</h1>
                <p>Payment Confirmation</p>
              </div>
              <div class="content">
                <div class="highlight approved">PAYMENT VERIFIED SUCCESSFULLY</div>
                
                <p>Dear ${data.applicant_name},</p>
                <p>Great news! Your payment has been verified and approved for the leave request of <strong>${data.soldier_name}</strong>.</p>
                
                <div class="section">
                  <h3>Payment Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Amount Paid:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                  <p><span class="label">Status:</span> COMPLETED</p>
                </div>
                
                <div class="section">
                  <h3>Next Steps</h3>
                  <p>You can now proceed to book your flight ticket:</p>
                  <ol>
                    <li>Visit the portal and go to "Book Flight Ticket"</li>
                    <li>Enter your tracking code: <strong>${data.tracking_code}</strong></li>
                    <li>Select your preferred aircraft class</li>
                    <li>Complete the flight booking</li>
                  </ol>
                </div>
                
                <p>Thank you for your payment. If you have any questions, contact us at Ltcol.defence@gmail.com</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };

    case 'payment_rejected':
      return {
        adminEmail: null,
        clientEmail: {
          subject: `PAYMENT NOT VERIFIED - Action Required - Code: ${data.tracking_code}`,
          html: `
            ${emailStyles}
            <div class="container">
              <div class="header" style="background: #991b1b;">
                <h1>D4 Battalion Squad</h1>
                <p>Payment Status Update</p>
              </div>
              <div class="content">
                <div class="highlight rejected">PAYMENT COULD NOT BE VERIFIED</div>
                
                <p>Dear ${data.applicant_name},</p>
                <p>We were unable to verify your payment for the leave request of <strong>${data.soldier_name}</strong>.</p>
                
                <div class="section">
                  <h3>Request Details</h3>
                  <p><span class="label">Tracking Code:</span> ${data.tracking_code}</p>
                  <p><span class="label">Amount Required:</span> $${Number(data.leave_amount).toLocaleString()}</p>
                </div>
                
                <div class="section">
                  <h3>What to Do Next</h3>
                  <ol>
                    <li>Please ensure the full amount was transferred to the correct account</li>
                    <li>Contact admin to verify the payment details</li>
                    <li>Once payment is confirmed, click "Yes, I have paid" again in the portal</li>
                  </ol>
                </div>
                
                <p><strong>Contact:</strong> Ltcol.defence@gmail.com | +1 (430) 291-3433</p>
              </div>
              <div class="footer">
                <p>D4 Battalion Squad - Military Services Portal</p>
              </div>
            </div>
          `,
        },
      };

    default:
      return {
        adminEmail: {
          subject: `[NOTIFICATION] ${type}`,
          html: `<p>Notification type: ${type}</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
        },
        clientEmail: null,
      };
  }
}
