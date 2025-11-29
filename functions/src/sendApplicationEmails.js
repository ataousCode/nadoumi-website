/**
 * Firebase Cloud Functions for sending application email notifications
 * 
 * Features:
 * - Send email to student when application status changes
 * - Send email to admin when new application is submitted
 * - Support for multi-language emails
 * 
 * Setup:
 * 1. Install dependencies: npm install nodemailer
 * 2. Configure email: firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
 * 3. Configure admin emails: firebase functions:config:set email.admin_emails="admin1@nadoumi.com,admin2@nadoumi.com"
 * 4. Deploy: firebase deploy --only functions
 */

const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin (if not already done)
if (!admin.apps.length) {
  admin.initializeApp()
}

// Configure email transporter
// For production, use SendGrid, Mailgun, or AWS SES
// Note: Environment variables should be set using:
// firebase functions:secrets:set EMAIL_USER
// firebase functions:secrets:set EMAIL_PASSWORD
// firebase functions:secrets:set ADMIN_EMAILS

let transporter = null

function getTransporter() {
  if (!transporter) {
    const emailUser = process.env.EMAIL_USER
    const emailPassword = process.env.EMAIL_PASSWORD
    
    if (!emailUser || !emailPassword) {
      console.error('❌ [Email Config] EMAIL_USER or EMAIL_PASSWORD not set!')
      console.error('❌ [Email Config] Please set secrets using:')
      console.error('❌ [Email Config] firebase functions:secrets:set EMAIL_USER')
      console.error('❌ [Email Config] firebase functions:secrets:set EMAIL_PASSWORD')
      throw new Error('Email configuration missing')
    }
    
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    })
    
    console.log('✅ [Email Config] Transporter initialized with user:', emailUser)
  }
  
  return transporter
}

// Email templates for each status
const EMAIL_TEMPLATES = {
  PENDING: {
    subject: (data) => `Application Received - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

Thank you for submitting your application (ID: ${data.applicationId}). 

We have received your application and will review it shortly. You will receive updates about your application status via email.

Next Steps:
- Our team will review your application within 3-5 business days
- You will be notified of any updates or additional requirements
- Please check your email regularly for updates

If you have any questions, please don't hesitate to contact us.

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
Submitted: ${data.submittedAt}
    `.trim(),
  },
  
  UNDER_REVIEW: {
    subject: (data) => `Your Application is Under Review - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

Your application (ID: ${data.applicationId}) is currently under review by our admissions team.

We are carefully reviewing your application materials and will contact you soon with the next steps.

Expected Timeline:
- Review process: 3-5 business days
- You will be notified via email of any updates

Thank you for your patience!

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
Current Status: Under Review
    `.trim(),
  },
  
  INTERVIEW_SCHEDULED: {
    subject: (data) => `Interview Scheduled - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

Congratulations! We would like to invite you for an interview.

📅 Interview Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date:     ${data.interviewDate || 'TBD'}
Time:     ${data.interviewTime || 'TBD'}
${data.interviewLocation ? `Location: ${data.interviewLocation}` : ''}
${data.interviewLink ? `Video Link: ${data.interviewLink}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.interviewNotes ? `Additional Notes:\n${data.interviewNotes}\n` : ''}

Please confirm your attendance by replying to this email at least 24 hours before the scheduled time.

Preparation Tips:
- Review your application materials
- Prepare questions about the program
- Test your internet connection (if online interview)
- Have a copy of your documents ready

We look forward to meeting you!

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
    `.trim(),
  },
  
  INTERVIEW_PASSED: {
    subject: (data) => `Congratulations! Interview Passed - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

Congratulations! 🎉

You have successfully passed the interview for your application (ID: ${data.applicationId}).

Your application is now moving to the final review stage. We will notify you of the final decision soon.

Next Steps:
- Final review of your application
- Decision notification within 5-7 business days
- Enrollment instructions (if accepted)

Thank you for your excellent performance during the interview!

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
Current Status: Interview Passed
    `.trim(),
  },
  
  ACCEPTED: {
    subject: (data) => `🎉 Application Accepted - Welcome to Nadoumi! - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

🎉 Congratulations! 🎉

We are pleased to inform you that your application (ID: ${data.applicationId}) has been ACCEPTED!

Welcome to Nadoumi Education! We are excited to have you join our program.

📋 Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review your acceptance letter (attached or to follow)
2. Complete enrollment registration within 14 days
3. Prepare required documents for visa application
4. Await detailed enrollment instructions from our team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our admissions team will contact you within 2 business days with:
- Detailed enrollment instructions
- Payment information
- Visa application guidance
- Arrival and orientation information

Important Dates:
- Enrollment deadline: [To be provided]
- Program start date: [To be provided]
- Orientation: [To be provided]

If you have any questions, please contact us immediately.

Once again, congratulations on your acceptance!

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
Status: ACCEPTED
Date: ${data.acceptedAt || new Date().toLocaleDateString()}
    `.trim(),
  },
  
  REJECTED: {
    subject: (data) => `Application Update - ${data.applicationId}`,
    body: (data) => `
Dear ${data.studentName},

Thank you for your interest in our programs and for taking the time to submit your application (ID: ${data.applicationId}).

After careful review, we regret to inform you that we cannot proceed with your application at this time.

${data.rejectionReason ? `Reason: ${data.rejectionReason}\n` : ''}
${data.rejectionFeedback ? `\nFeedback:\n${data.rejectionFeedback}\n` : ''}

We understand this may be disappointing news. However, we encourage you to:
- Consider reapplying in the future
- Explore our other programs that may be a better fit
- Contact us if you have any questions about this decision

We appreciate your interest and wish you the very best in your educational pursuits.

Best regards,
Nadoumi Education Team

---
Application ID: ${data.applicationId}
    `.trim(),
  },
}

/**
 * Get email template for a given status
 */
function getEmailTemplate(status, data) {
  const template = EMAIL_TEMPLATES[status]
  if (!template) {
    return EMAIL_TEMPLATES.PENDING // Fallback
  }
  
  return {
    subject: template.subject(data),
    body: template.body(data),
  }
}

/**
 * Firestore trigger: When application status changes, send email to student
 */
exports.onApplicationStatusChange = onDocumentUpdated(
  {
    document: "applications/{applicationId}",
    region: "us-central1", // Specify region for better performance
  },
  async (event) => {
    try {
      const change = event.data;
      const context = event.params;
      const before = change.before.data()
      const after = change.after.data()
      
      console.log(`📧 [Email Function] Application ${context.applicationId} updated`)
      console.log(`📧 [Email Function] Before status: ${before.status}, After status: ${after.status}`)
      
      // Check if status actually changed
      if (before.status === after.status) {
        console.log(`📧 [Email Function] No status change for application ${context.applicationId}`)
        return null
      }
      
      const applicationId = context.applicationId
      const newStatus = after.status
      
      // Extract student information from the actual application structure
      // Application structure: { applicant: { firstName, lastName, email, phone }, fields: { ... }, desiredProgram }
      const applicant = after.applicant || {}
      const fields = after.fields || {}
      
      console.log(`📧 [Email Function] Applicant data:`, JSON.stringify(applicant))
      console.log(`📧 [Email Function] Fields data keys:`, Object.keys(fields))
      
      const firstName = applicant.firstName || fields.firstName || ''
      const lastName = applicant.lastName || fields.lastName || ''
      const studentName = `${firstName} ${lastName}`.trim() || 'Student'
      const studentEmail = applicant.email || fields.email || null
      
      console.log(`📧 [Email Function] Student: ${studentName} (${studentEmail})`)
      
      if (!studentEmail) {
        console.error(`❌ [Email Function] No email found for application ${applicationId}`)
        console.error(`❌ [Email Function] Applicant object:`, JSON.stringify(applicant))
        console.error(`❌ [Email Function] Fields object keys:`, Object.keys(fields))
        return null
      }
      
      console.log(`✅ [Email Function] Status changed from ${before.status} to ${newStatus} for application ${applicationId}`)
      console.log(`✅ [Email Function] Will send email to: ${studentEmail}`)
    
    // Handle submittedAt - can be Timestamp, number (milliseconds), or Date
    let submittedAt = new Date().toLocaleDateString()
    if (after.submittedAt) {
      if (after.submittedAt.seconds) {
        // Firestore Timestamp
        submittedAt = new Date(after.submittedAt.seconds * 1000).toLocaleDateString()
      } else if (typeof after.submittedAt === 'number') {
        // Milliseconds timestamp
        submittedAt = new Date(after.submittedAt).toLocaleDateString()
      } else if (after.submittedAt.toDate) {
        // Timestamp object with toDate method
        submittedAt = after.submittedAt.toDate().toLocaleDateString()
      } else {
        submittedAt = new Date(after.submittedAt).toLocaleDateString()
      }
    }
    
    // Handle acceptedAt
    let acceptedAt = new Date().toLocaleDateString()
    if (after.acceptedAt) {
      if (after.acceptedAt.seconds) {
        acceptedAt = new Date(after.acceptedAt.seconds * 1000).toLocaleDateString()
      } else if (typeof after.acceptedAt === 'number') {
        acceptedAt = new Date(after.acceptedAt).toLocaleDateString()
      } else if (after.acceptedAt.toDate) {
        acceptedAt = after.acceptedAt.toDate().toLocaleDateString()
      } else {
        acceptedAt = new Date(after.acceptedAt).toLocaleDateString()
      }
    }
    
    // Prepare email data
    const emailData = {
      applicationId,
      studentName,
      submittedAt,
      interviewDate: after.interviewDetails?.date || '',
      interviewTime: after.interviewDetails?.time || '',
      interviewLocation: after.interviewDetails?.location || '',
      interviewLink: after.interviewDetails?.link || '',
      interviewNotes: after.interviewDetails?.notes || '',
      rejectionReason: after.rejectionDetails?.reason || '',
      rejectionFeedback: after.rejectionDetails?.feedback || '',
      acceptedAt,
    }
    
    const template = getEmailTemplate(newStatus, emailData)
    
      // Send email
      console.log(`📧 [Email Function] Preparing to send email...`)
      console.log(`📧 [Email Function] Email config check - User: ${process.env.EMAIL_USER ? 'Set' : 'NOT SET'}`)
      console.log(`📧 [Email Function] Email config check - Password: ${process.env.EMAIL_PASSWORD ? 'Set' : 'NOT SET'}`)
      
      const emailTransporter = getTransporter()
      const info = await emailTransporter.sendMail({
        from: '"Nadoumi Education" <noreply@nadoumi.com>',
        to: studentEmail,
        subject: template.subject,
        text: template.body,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Nadoumi Education</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.6; color: #374151;">${template.body}</pre>
            </div>
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Nadoumi Education. All rights reserved.</p>
              <p>If you have questions, reply to this email or contact us at info@nadoumi.com</p>
            </div>
          </div>
        `,
      })
      
      console.log(`✅ [Email Function] Email sent successfully to ${studentEmail} for status ${newStatus}`)
      console.log(`✅ [Email Function] Message ID: ${info.messageId}`)
      return null
    } catch (error) {
      console.error(`❌ [Email Function] Failed to send email:`, error)
      console.error(`❌ [Email Function] Error details:`, {
        message: error.message,
        stack: error.stack,
        code: error.code,
        response: error.response
      })
      // Don't throw - we don't want to fail the document update
      return null
    }
});

/**
 * Firestore trigger: When new application is created, notify admin
 */
exports.onNewApplication = onDocumentCreated(
  {
    document: "applications/{applicationId}",
    region: "us-central1",
  },
  async (event) => {
    const snapshot = event.data;
    const context = event.params;
    const application = snapshot.data()
    const applicationId = context.applicationId
    
    // Extract student information from the actual application structure
    // Application structure: { applicant: { firstName, lastName, email, phone }, fields: { ... }, desiredProgram }
    const applicant = application.applicant || {}
    const fields = application.fields || {}
    
    const firstName = applicant.firstName || fields.firstName || ''
    const lastName = applicant.lastName || fields.lastName || ''
    const studentName = `${firstName} ${lastName}`.trim() || 'Unknown'
    const studentEmail = applicant.email || fields.email || 'N/A'
    const studentPhone = applicant.phone || fields.phone || 'N/A'
    const country = fields.nationality || applicant.nationality || 'N/A'
    
    // Handle submittedAt - can be Timestamp, number (milliseconds), or Date
    let submittedAt = 'N/A'
    if (application.submittedAt) {
      if (application.submittedAt.seconds) {
        // Firestore Timestamp
        submittedAt = new Date(application.submittedAt.seconds * 1000).toLocaleString()
      } else if (typeof application.submittedAt === 'number') {
        // Milliseconds timestamp
        submittedAt = new Date(application.submittedAt).toLocaleString()
      } else if (application.submittedAt.toDate) {
        // Timestamp object with toDate method
        submittedAt = application.submittedAt.toDate().toLocaleString()
      } else {
        submittedAt = new Date(application.submittedAt).toLocaleString()
      }
    }
    
    // Get admin emails from config
    const adminEmailsString = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsString.split(",").map((e) => e.trim()).filter(Boolean);
    
    if (adminEmails.length === 0) {
      console.log('⚠️ No admin emails configured')
      return null
    }
    
    const reviewLink = `https://nadoumi.com/admin/applications/${applicationId}`
    
    const emailBody = `
🔔 New Student Application Received

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Student Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:       ${studentName}
Email:      ${studentEmail}
Phone:      ${studentPhone}
Country:    ${country}
Program:    ${application.desiredProgram || fields.desiredProgram || 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Application ID:  ${applicationId}
Submitted:       ${submittedAt}
Status:          PENDING

Review Application:
${reviewLink}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from Nadoumi Admin System.
Please review and process this application as soon as possible.
    `.trim()
    
    try {
      const emailTransporter = getTransporter()
      const info = await emailTransporter.sendMail({
        from: '"Nadoumi Admin System" <noreply@nadoumi.com>',
        to: adminEmails,
        subject: `🔔 New Application - ${studentName || 'Unknown'} (${applicationId})`,
        text: emailBody,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb;">
              <div style="background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 20px;">🔔 New Application Received</h1>
              </div>
              <div style="padding: 30px;">
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #374151; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Student Information:</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Name:</td>
                      <td style="padding: 8px 0; color: #374151;">${studentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
                      <td style="padding: 8px 0; color: #374151;">${studentEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Phone:</td>
                      <td style="padding: 8px 0; color: #374151;">${studentPhone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Country:</td>
                      <td style="padding: 8px 0; color: #374151;">${country}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Program:</td>
                      <td style="padding: 8px 0; color: #374151;">${application.desiredProgram || fields.desiredProgram || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Application ID:</td>
                      <td style="padding: 8px 0; color: #374151; font-family: monospace;">${applicationId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Submitted:</td>
                      <td style="padding: 8px 0; color: #374151;">${submittedAt}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Status:</td>
                      <td style="padding: 8px 0; color: #374151;"><span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">PENDING</span></td>
                    </tr>
                  </table>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${reviewLink}" style="display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Review Application</a>
                </div>
              </div>
            </div>
          </div>
        `,
      })
      
      console.log(`✅ Admin notification sent for application ${applicationId}`, info.messageId)
      return null
    } catch (error) {
      console.error(`❌ Failed to send admin notification for application ${applicationId}:`, error)
      return null
    }
});

