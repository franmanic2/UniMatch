import { reactive } from 'vue';

export const notificationStore = reactive({
  state: {
    show: false,
    message: '',
    type: 'success', // 'success' or 'error'
    duration: 3000
  },

  showNotification(message, type = 'success', duration = 3000) {
    this.state.message = message;
    this.state.type = type;
    this.state.duration = duration;
    this.state.show = true;

    if (duration > 0) {
      setTimeout(() => {
        this.hideNotification();
      }, duration);
    }
  },

  hideNotification() {
    this.state.show = false;
  },

  // Prepare a notification to be shown after the next page reload (useful for login/register redirects)
  setPendingNotification(message, type = 'success') {
    sessionStorage.setItem('pending_toast', JSON.stringify({ message, type }));
  },

  // Check and show any pending notifications (call this on App mount)
  checkPendingNotification() {
    const pending = sessionStorage.getItem('pending_toast');
    if (pending) {
      const { message, type } = JSON.parse(pending);
      this.showNotification(message, type);
      sessionStorage.removeItem('pending_toast');
    }
  }
});
