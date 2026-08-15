export const getPaymentFailedEmail = ({ fullName, applicationId, serviceTitle, amount }) => {
  return {
    subject: `Payment Not Completed: Ref ${applicationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #dc2626; padding: 16px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">CSC CENTER - PAYMENT NOT COMPLETED</h2>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <p style="font-size: 16px; font-weight: bold;">Dear ${fullName},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            Your transaction of ₹${amount} for application <strong>${applicationId}</strong> (${serviceTitle}) was not completed or was cancelled.
          </p>

          <p style="font-size: 14px; line-height: 1.6;">
            If funds were deducted from your bank account, they will be automatically refunded by your bank per standard banking timelines. You may retry your payment safely from your customer portal.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
          CSC Center • Digital Service Assistance Hub • Support: support@csccenter.in
        </div>
      </div>
    `
  };
};
