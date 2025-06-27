import { config } from "@/config";

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogContext {
  userId?: string;
  action?: string;
  component?: string;
  [key: string]: any;
}

class Logger {
  private isDev = config.IS_DEV;
  private isProduction = config.IS_PROD;

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings
    if (this.isProduction) {
      return level === "error" || level === "warn";
    }
    return true;
  }

  private sendToMonitoring(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: LogContext
  ) {
    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    if (this.isProduction && (level === "error" || level === "warn")) {
      // Example: Sentry.captureException(error || new Error(message), { extra: context });
      console.log("📡 Would send to monitoring:", {
        level,
        message,
        error,
        context,
      });
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    if (!this.shouldLog("error")) return;

    const formattedMessage = this.formatMessage("error", message, context);

    if (this.isDev) {
      console.error("🚨 " + formattedMessage);
      if (error) {
        console.error(error);
      }
    }

    this.sendToMonitoring("error", message, error, context);
  }

  warn(message: string, context?: LogContext) {
    if (!this.shouldLog("warn")) return;

    const formattedMessage = this.formatMessage("warn", message, context);

    if (this.isDev) {
      console.warn("⚠️ " + formattedMessage);
    }

    this.sendToMonitoring("warn", message, undefined, context);
  }

  info(message: string, context?: LogContext) {
    if (!this.shouldLog("info")) return;

    const formattedMessage = this.formatMessage("info", message, context);

    if (this.isDev) {
      console.info("ℹ️ " + formattedMessage);
    }
  }

  debug(message: string, context?: LogContext) {
    if (!this.shouldLog("debug")) return;

    const formattedMessage = this.formatMessage("debug", message, context);

    if (this.isDev) {
      console.debug("🐛 " + formattedMessage);
    }
  }

  // Helper method for API responses
  apiCall(
    method: string,
    url: string,
    status: number,
    duration?: number,
    context?: LogContext
  ) {
    const message = `API ${method.toUpperCase()} ${url} - ${status}`;
    const logContext = {
      ...context,
      method,
      url,
      status,
      duration: duration ? `${duration}ms` : undefined,
    };

    if (status >= 400) {
      this.error(message, undefined, logContext);
    } else if (status >= 300) {
      this.warn(message, logContext);
    } else {
      this.info(message, logContext);
    }
  }

  // Helper method for user actions
  userAction(action: string, userId?: string, context?: LogContext) {
    this.info(`User action: ${action}`, { ...context, action, userId });
  }

  // Helper method for performance
  performance(label: string, duration: number, context?: LogContext) {
    const message = `Performance: ${label} took ${duration}ms`;

    if (duration > 1000) {
      this.warn(message, { ...context, duration, slow: true });
    } else {
      this.debug(message, { ...context, duration });
    }
  }
}

export const logger = new Logger();

// Helper function for measuring performance
export function measurePerformance<T>(
  label: string,
  fn: () => T,
  context?: LogContext
): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    logger.performance(label, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(
      `${label} failed after ${duration}ms`,
      error as Error,
      context
    );
    throw error;
  }
}

// Helper function for measuring async performance
export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(label, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(
      `${label} failed after ${duration}ms`,
      error as Error,
      context
    );
    throw error;
  }
}
