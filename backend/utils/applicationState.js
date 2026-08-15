/**
 * Application Lifecycle State Machine
 * Validates allowed application status transitions server-side.
 */

export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  DOCUMENT_REQUIRED: 'document_required',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

// Allowed Server-Side Transitions Map (Requirement 21)
const ALLOWED_TRANSITIONS = {
  [APPLICATION_STATUSES.PENDING]: [
    APPLICATION_STATUSES.UNDER_REVIEW
  ],
  [APPLICATION_STATUSES.UNDER_REVIEW]: [
    APPLICATION_STATUSES.DOCUMENT_REQUIRED,
    APPLICATION_STATUSES.APPROVED,
    APPLICATION_STATUSES.REJECTED
  ],
  [APPLICATION_STATUSES.DOCUMENT_REQUIRED]: [
    APPLICATION_STATUSES.UNDER_REVIEW
  ],
  [APPLICATION_STATUSES.APPROVED]: [
    APPLICATION_STATUSES.COMPLETED
  ],
  [APPLICATION_STATUSES.COMPLETED]: [],
  [APPLICATION_STATUSES.REJECTED]: []
};

/**
 * Check if a status string is a recognized valid application status
 */
export const isValidStatus = (status) => {
  return Object.values(APPLICATION_STATUSES).includes(status);
};

/**
 * Verify whether transitioning from currentStatus to targetStatus is permitted
 */
export const isValidTransition = (currentStatus, targetStatus) => {
  if (!currentStatus || !targetStatus) return false;
  if (currentStatus === targetStatus) return true; // Re-saving same status with note is permitted

  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(targetStatus);
};
