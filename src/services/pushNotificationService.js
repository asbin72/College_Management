/**
 * Web Push Notification Service for Kalpanaaa Education CMS
 * Handles Browser Native Notification permissions, assignment due date reminders,
 * and real-time attendance alerts.
 */

// Check if browser supports Web Notifications
export const isPushSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Get current permission status ('granted', 'denied', or 'default')
export const getNotificationPermission = () => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
};

// Request Notification Permission from User
export const requestPushPermission = async () => {
  if (!isPushSupported()) {
    console.warn('Web Push Notifications are not supported in this browser environment.');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Dispatch a Native Browser Push Notification
export const sendNativePushNotification = (title, options = {}) => {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    console.log('Push notification skipped: permission not granted or unsupported.', { title, options });
    return false;
  }

  try {
    const defaultIcon = '/vite.svg';
    const notification = new Notification(title, {
      icon: options.icon || defaultIcon,
      badge: options.badge || defaultIcon,
      body: options.body || '',
      tag: options.tag || `notif-${Date.now()}`,
      requireInteraction: options.requireInteraction || false,
      silent: false,
      ...options
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to trigger native push notification:', err);
    return false;
  }
};

// Trigger Assignment Due Date Alert
export const triggerAssignmentDuePush = (assignmentTitle, dueDate, subjectName) => {
  return sendNativePushNotification(`⏰ Assignment Due Soon: ${assignmentTitle}`, {
    body: `${subjectName} assignment is due on ${dueDate}. Submit your work on time to avoid grade deduction!`,
    tag: `assignment-due-${assignmentTitle}`,
    requireInteraction: true,
    url: '/student/assignments'
  });
};

// Trigger Attendance Shortage / Absent Alert
export const triggerAttendancePush = (studentName, subjectName, date, status = 'Absent') => {
  const isAbsent = status.toLowerCase() === 'absent';
  const title = isAbsent ? `⚠️ Attendance Alert: Marked Absent` : `📊 Attendance Status Update`;
  const body = isAbsent
    ? `Dear ${studentName}, you were marked ABSENT for ${subjectName} on ${date}. Please review your attendance record.`
    : `Your attendance record for ${subjectName} was updated to ${status} on ${date}.`;

  return sendNativePushNotification(title, {
    body,
    tag: `attendance-${date}-${subjectName}`,
    requireInteraction: isAbsent,
    url: '/student/attendance'
  });
};

// Trigger Test Push Notification
export const sendTestPushNotification = () => {
  return sendNativePushNotification('🔔 Kalpanaaa Web Push Active!', {
    body: 'Web push notifications are fully configured for assignment due dates and attendance alerts.',
    tag: 'test-push-notification'
  });
};
