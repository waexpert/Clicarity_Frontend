// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Modal Configuration
export const MODAL_CONFIG = {
  MAX_WIDTH: 'max-w-3xl',
  MAX_HEIGHT: 'max-h-[80vh]',
};

// Column Types
export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'tel',
  URL: 'url',
  DATE: 'date',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  SELECT_STATUS: 'select-status',
  SELECT_PRIORITY: 'select-priority',
};

// Status Options
export const STATUS_OPTIONS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
};

// Priority Options
export const PRIORITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Badge Colors
export const STATUS_BADGE_COLORS = {
  [STATUS_OPTIONS.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [STATUS_OPTIONS.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
  [STATUS_OPTIONS.COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const PRIORITY_BADGE_COLORS = {
  [PRIORITY_OPTIONS.HIGH]: 'bg-red-100 text-red-700 border-red-200',
  [PRIORITY_OPTIONS.MEDIUM]: 'bg-orange-100 text-orange-700 border-orange-200',
  [PRIORITY_OPTIONS.LOW]: 'bg-green-100 text-green-700 border-green-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

// Excluded Columns
export const EXCLUDED_COLUMNS = {
  FROM_DISPLAY: ['id'],
  FROM_FORM: ['id', 'created_at', 'updated_at'],
  COMMENT_FIELDS: '_comment',
  BALANCE_FIELDS: '_balance',
};

// Date Field Identifiers
export const DATE_FIELDS = [
  'invoice',
  'date',
  'due_date',
  'final_due_date',
  'last_overdue_reminder_date',
  'sent_at',
  'created_at',
  'updated_at',
];

// Array Field Identifiers
export const ARRAY_FIELDS = ['out_webhooks', 'emails'];

// Auto-filled Fields
export const AUTO_FILLED_FIELDS = {
  PA_ID: 'pa_id',
  US_ID: 'us_id',
};