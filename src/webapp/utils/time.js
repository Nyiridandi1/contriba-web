// src/webapp/utils/time.js

/**
 * Converts a database timestamp into a human-friendly relative time.
 *
 * Supabase/PostgreSQL timestamps are treated as UTC when they do not
 * already contain timezone information. JavaScript then compares them
 * against the user's real current time.
 *
 * Examples:
 * "Just now"
 * "2 minutes ago"
 * "1 hour ago"
 * "Yesterday"
 */
export function timeAgo(timestamp) {
  if (!timestamp) return '';

  let value = String(timestamp).trim();

  // PostgreSQL may return:
  // 2026-07-29T15:06:19.5623
  //
  // If there is no timezone suffix, explicitly treat it as UTC.
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);

  if (!hasTimezone) {
    value += 'Z';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const difference = now.getTime() - date.getTime();

  // Protect against small clock differences.
  if (difference < 0) {
    return 'Just now';
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 45) return 'Just now';

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (days === 1) return 'Yesterday';

  if (days < 7) {
    return `${days} days ago`;
  }

  if (weeks < 5) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}