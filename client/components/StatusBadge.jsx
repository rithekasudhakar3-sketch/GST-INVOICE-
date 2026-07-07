'use client';

import { getStatusColor, getStatusIcon } from '@/lib/utils';

export function StatusBadge({ status, label }) {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
      <span>{getStatusIcon(status)}</span>
      {displayLabel}
    </span>
  );
}
