export const openMidtransSnap = (snapToken, callbacks = {}) => {
  if (!window.snap) {
    throw new Error("Midtrans Snap.js is not loaded");
  }

  window.snap.pay(snapToken, callbacks);
};
