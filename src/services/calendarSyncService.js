/**
 * Calendar Sync Service for Kalpanaaa Education CMS
 * Generates Google Calendar URLs and downloadable iCal (.ics) files for lecture timings.
 */

// Helper to format ISO date strings for Google Calendar & iCal (YYYYMMDDTHHmmssZ)
const formatCalendarDate = (dateObj) => {
  const pad = (n) => (n < 10 ? '0' + n : n);
  const year = dateObj.getUTCFullYear();
  const month = pad(dateObj.getUTCMonth() + 1);
  const day = pad(dateObj.getUTCDate());
  const hours = pad(dateObj.getUTCHours());
  const minutes = pad(dateObj.getUTCMinutes());
  const seconds = pad(dateObj.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * Generate Google Calendar TEMPLATE URL
 * @param {Object} eventDetails 
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarLink = ({
  title,
  description,
  location,
  startDate = new Date(),
  durationMinutes = 60,
  recurrence = 'WEEKLY'
}) => {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const startFormatted = formatCalendarDate(start);
  const endFormatted = formatCalendarDate(end);

  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Kalpanaaa Lecture Timing',
    details: description || 'Lecture session scheduled in Kalpanaaa Education CMS.',
    location: location || 'Main Campus',
    dates: `${startFormatted}/${endFormatted}`,
    recur: `RRULE:FREQ=${recurrence};UNTIL=20261231T235959Z`
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate and download an iCal (.ics) file for Apple Calendar, Outlook, Mobile
 * @param {Object} eventDetails 
 */
export const downloadICalFile = ({
  title,
  description,
  location,
  startDate = new Date(),
  durationMinutes = 60,
  recurrence = 'WEEKLY',
  fileName = 'lecture_schedule.ics'
}) => {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const startFormatted = formatCalendarDate(start);
  const endFormatted = formatCalendarDate(end);
  const nowFormatted = formatCalendarDate(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kalpanaaa Education CMS//Lecture Timings//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:lecture-${Date.now()}@kalpanaaa.edu`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `RRULE:FREQ=${recurrence}`,
    `SUMMARY:${title || 'Kalpanaaa Lecture Session'}`,
    `DESCRIPTION:${(description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${location || 'Main Campus Venue'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
