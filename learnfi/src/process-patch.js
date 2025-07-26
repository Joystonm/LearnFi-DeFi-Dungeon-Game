// This file patches the global process object
if (typeof window !== 'undefined') {
  window.process = window.process || {
    env: {},
    browser: true,
    version: '',
    nextTick: function(cb) { setTimeout(cb, 0); }
  };
}
