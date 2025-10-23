import { toast } from "sonner";

const DEFAULT_DURATION = 3000;

const TOAST_HANDLERS = {
  success: toast.success,
  error: toast.error,
  info: toast.info ?? ((message, options) => toast(message, options)),
  warning: toast.warning ?? ((message, options) => toast(message, options)),
  loading: toast.loading,
  default: toast,
};

const VARIANT_STYLES = {
  success: {
    background: "#ecfdf3",
    borderColor: "#16a34a",
    color: "#166534",
  },
  error: {
    background: "#fef2f2",
    borderColor: "#dc2626",
    color: "#991b1b",
  },
  info: {
    background: "#eff6ff",
    borderColor: "#0a65cc",
    color: "#0b3c8f",
  },
  warning: {
    background: "#fff7ed",
    borderColor: "#f97316",
    color: "#9a3412",
  },
  loading: {
    background: "#f4f4f5",
    borderColor: "#3f3f46",
    color: "#18181b",
  },
  default: {
    background: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },
};

const VARIANT_DEFAULTS = {
  loading: {
    duration: Infinity,
    dismissible: false,
  },
};

const BASE_STYLE = {
  border: "1px solid transparent",
  borderRadius: "var(--radius-md, 12px)",
  boxShadow: "var(--shadow-md, 0 20px 25px -5px rgba(15,23,42,0.15))",
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "var(--text-sm, 14px)",
  fontWeight: 500,
  padding: "12px 16px",
};

const PROMISE_FALLBACK_MESSAGES = {
  loading: "Processing...",
  success: "Completed successfully.",
  error: "Something went wrong.",
};

const resolveHandler = (variant) => TOAST_HANDLERS[variant] ?? TOAST_HANDLERS.default;

const resolveStyle = (variant, userStyle) => ({
  ...BASE_STYLE,
  ...(VARIANT_STYLES[variant] ?? VARIANT_STYLES.default),
  ...userStyle,
});

const buildOptions = (variant, options = {}) => {
  const { style: userStyle, duration, dismissible, ...rest } = options;
  const variantDefaults = VARIANT_DEFAULTS[variant] ?? {};

  return {
    duration: duration ?? variantDefaults.duration ?? DEFAULT_DURATION,
    dismissible: dismissible ?? variantDefaults.dismissible ?? true,
    ...rest,
    style: resolveStyle(variant, userStyle),
  };
};

const showToast = (variant, message, options) => {
  const handler = resolveHandler(variant);
  return handler(message, buildOptions(variant, options));
};

const resolveContent = (content, payload) =>
  typeof content === "function" ? content(payload) : (content ?? "");

const getPromiseMessage = (content, fallback, payload) => {
  const resolved = resolveContent(content, payload);
  return resolved === "" ? fallback : resolved;
};

export const notifySuccess = (message, options) => showToast("success", message, options);

export const notifyError = (message, options) => showToast("error", message, options);

export const notifyInfo = (message, options) => showToast("info", message, options);

export const notifyWarning = (message, options) => showToast("warning", message, options);

export const notify = (message, options) => showToast("default", message, options);

export const notifyPromise = (promiseOrFactory, { loading, success, error }) => {
  const operation = typeof promiseOrFactory === "function" ? promiseOrFactory() : promiseOrFactory;

  if (!operation || typeof operation.then !== "function") {
    throw new Error("notifyPromise expects a promise or a function returning a promise.");
  }

  const toastId = showToast(
    "loading",
    getPromiseMessage(loading, PROMISE_FALLBACK_MESSAGES.loading),
    {}
  );

  return operation
    .then((result) => {
      const successMessage = getPromiseMessage(success, PROMISE_FALLBACK_MESSAGES.success, result);
      showToast("success", successMessage, { id: toastId });
      return result;
    })
    .catch((err) => {
      const errorMessage = getPromiseMessage(error, PROMISE_FALLBACK_MESSAGES.error, err);
      showToast("error", errorMessage, { id: toastId });
      throw err;
    });
};
