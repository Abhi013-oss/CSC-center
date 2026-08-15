export const getStatusChangedEmail = ({ fullName, applicationId, serviceTitle, oldStatus, newStatus, note }) => {
  const statusLabels = {
    pending: 'Pending Review',
    under_review: 'Under Review',
    document_required: 'Additional Documents Required',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected'
  };

  const formattedStatus = statusLabels[newStatus] || newStatus;

  return {
    subject: `Application Status Updated: ${formattedStatus} - Ref ${applicationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #4f46e5; padding: 16px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">CSC CENTER - APPLICATION UPDATE</h2>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <p style="font-size: 16px; font-weight: bold;">Dear ${fullName},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            The processing status for your application (<strong>${applicationId}</strong> - ${serviceTitle}) has been updated.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #64748b; font-weight: bold; uppercase;">New Status</div>
            <div style="font-size: 18px; font-weight: bold; color: #4f46e5; margin-top: 4px;">${formattedStatus}</div>
            ${note ? `<div style="font-size: 13px; color: #334155; margin-top: 8px; padding-top: 8px; border-top: 1px italic #cbd5e1;"><strong>Note:</strong> "${note}"</div>` : ''}
          </div>

          ${newStatus === 'document_required' ? `
            <p style="font-size: 14px; color: #7e22ce; font-weight: bold; background-color: #faf5ff; padding: 12px; border-radius: 6px; border: 1px solid #e9d5ff;">
              Please log in to your account and attach the requested supporting documents to resume processing.
            </p>
          ` : ''}

          <p style="font-size: 14px; line-height: 1.6;">
            Log in to your CSC Center account to view full application details and status audit history.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
          CSC Center • Digital Service Assistance Hub • Support: support@csccenter.in
        </div>
      </div>
    `
  };
};
