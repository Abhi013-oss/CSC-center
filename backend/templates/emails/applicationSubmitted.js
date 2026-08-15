export const getApplicationSubmittedEmail = ({ fullName, applicationId, serviceTitle }) => {
  return {
    subject: `Application Submitted - Ref ID: ${applicationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
        <div style="background-color: #4f46e5; padding: 16px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">CSC CENTER - DIGITAL SERVICES</h2>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <p style="font-size: 16px; font-weight: bold;">Dear ${fullName},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            Your online application for <strong>${serviceTitle}</strong> has been successfully registered in our database system.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Application Reference ID</span>
            <div style="font-family: monospace; font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px;">${applicationId}</div>
          </div>

          <p style="font-size: 14px; line-height: 1.6;">
            You can track your application status at any time from your customer portal or by using our public tracking tool.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
          CSC Center • Digital Service Assistance Hub • Support: support@csccenter.in
        </div>
      </div>
    `
  };
};
