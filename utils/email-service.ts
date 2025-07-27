// Email service simulation for medication reminders
// In a real app, this would integrate with services like SendGrid, AWS SES, or Resend

export interface EmailReminder {
  email: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  reminderTime: string;
  scheduledFor: string;
}

export class EmailService {
  private static instance: EmailService;
  private scheduledReminders: EmailReminder[] = [];

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async scheduleReminder(reminder: EmailReminder): Promise<boolean> {
    try {
      // In a real app, this would:
      // 1. Call your backend API to schedule the reminder
      // 2. Use a service like SendGrid, AWS SES, or Resend
      // 3. Set up cron jobs or use a task scheduler
      
      console.log(`📧 Scheduling email reminder for ${reminder.medicationName}`);
      console.log(`   Time: ${reminder.reminderTime}`);
      console.log(`   Frequency: ${reminder.frequency}`);
      console.log(`   Email: ${reminder.email}`);
      
      this.scheduledReminders.push(reminder);
      
      // Simulate the email being sent at the scheduled time
      this.simulateEmailSending(reminder);
      
      return true;
    } catch (error) {
      console.error("Failed to schedule email reminder:", error);
      return false;
    }
  }

  private simulateEmailSending(reminder: EmailReminder) {
    // In a real app, this would be handled by a proper email service
    // For demo purposes, we'll simulate sending after a short delay
    setTimeout(() => {
      console.log(`📧 EMAIL SENT: Medication Reminder`);
      console.log(`   To: ${reminder.email}`);
      console.log(`   Subject: Time to take your medication!`);
      console.log(`   Body: It's time to take ${reminder.medicationName} ${reminder.dosage} (${reminder.frequency})`);
      console.log(`   Sent at: ${new Date().toLocaleString()}`);
    }, 5000); // Simulate 5 second delay
  }

  async sendTestEmail(email: string, medicationName: string): Promise<boolean> {
    try {
      console.log(`📧 Sending test email to ${email} for ${medicationName}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ Test email sent successfully!`);
      return true;
    } catch (error) {
      console.error("Failed to send test email:", error);
      return false;
    }
  }

  getScheduledReminders(): EmailReminder[] {
    return this.scheduledReminders;
  }

  // In a real app, you would also have methods to:
  // - Cancel scheduled reminders
  // - Update reminder times
  // - Handle email delivery failures
  // - Track email open rates
  // - Send follow-up reminders
} 