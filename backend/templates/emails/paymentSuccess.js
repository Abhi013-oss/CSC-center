export const getPaymentSuccessEmail = ({ fullName, applicationId, serviceTitle, transactionId, amount, paidAt }) => {
  return {
    subject: `Payment Receipt: ₹${amount} - Ref ${applicationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #059669; padding: 16px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">CSC CENTER - PAYMENT CONFIRMED</h2>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <p style="font-size: 16px; font-weight: bold;">Dear ${fullName},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            We have verified and logged your online payment for application <strong>${applicationId}</strong> (${serviceTitle}).
          </p>

          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; font-size: 14px; color: #065f46;">
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Transaction ID:</td>
                <td style="padding: 4px 0; font-family: monospace; font-weight: bold; text-align: right;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Amount Paid:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right;">₹${amount} INR</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Payment Date:</td>
                <td style="padding: 4px 0; text-align: right;">${new Date(paidAt || Date.now()).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Payment Status:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right; color: #047857;">VERIFIED & PAID</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; line-height: 1.6;">
            You can download a printable payment receipt from your customer portal under My Payments.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
          CSC Center • Digital Service Assistance Hub • Support: support@csccenter.in
        </div>
      </div>
    `
  };
};
