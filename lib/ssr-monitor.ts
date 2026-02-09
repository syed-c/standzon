// Production error monitoring utility
// This should be integrated with your error tracking service

interface SSRErrorReport {
  timestamp: string;
  url: string;
  component: string;
  errorType: string;
  errorMessage: string;
  userAgent?: string;
  isBot: boolean;
  stackTrace?: string;
}

class SSRMonitor {
  private static instance: SSRMonitor;
  private errorBuffer: SSRErrorReport[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SSRMonitor {
    if (!SSRMonitor.instance) {
      SSRMonitor.instance = new SSRMonitor();
    }
    return SSRMonitor.instance;
  }

  // Log SSR errors safely
  logError(error: Error, component: string, url: string, userAgent?: string): void {
    try {
      const report: SSRErrorReport = {
        timestamp: new Date().toISOString(),
        url,
        component,
        errorType: error.constructor.name,
        errorMessage: error.message,
        userAgent,
        isBot: this.isBot(userAgent),
        stackTrace: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };

      this.errorBuffer.push(report);
      
      // Console logging for immediate visibility
      console.error(`❌ SSR Error in ${component}:`, {
        url,
        error: error.message,
        isBot: report.isBot
      });

      // Flush errors periodically or when buffer is full
      if (this.errorBuffer.length >= 10 || !this.flushTimer) {
        this.flushErrors();
      } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => this.flushErrors(), 30000); // Flush every 30 seconds
      }

    } catch (loggingError) {
      // Never let logging throw
      console.error('❌ Error logging failed:', loggingError);
    }
  }

  private isBot(userAgent?: string): boolean {
    if (!userAgent) return false;
    return /bot|crawler|spider|google|bing|yahoo|baidu|yandex/i.test(userAgent);
  }

  private async flushErrors(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.errorBuffer.length === 0) return;

    const errorsToFlush = [...this.errorBuffer];
    this.errorBuffer = [];

    try {
      // In production, send to your error tracking service
      // Example integrations:
      
      // Sentry
      // if (typeof Sentry !== 'undefined') {
      //   errorsToFlush.forEach(report => {
      //     Sentry.captureException(new Error(report.errorMessage), {
      //       tags: {
      //         component: report.component,
      //         url: report.url,
      //         isBot: report.isBot
      //       },
      //       extra: {
      //         timestamp: report.timestamp,
      //         userAgent: report.userAgent
      //       }
      //     });
      //   });
      // }

      // Or send to custom endpoint
      // await fetch('/api/log-ssr-errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorsToFlush)
      // });

      // For now, just ensure we don't lose the data
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 SSR Error Report:', errorsToFlush);
      }

    } catch (flushError) {
      // Restore errors to buffer if flush failed
      this.errorBuffer.unshift(...errorsToFlush);
      console.error('❌ Error flushing failed:', flushError);
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    await this.flushErrors();
  }
}

// Export singleton instance
export const ssrMonitor = SSRMonitor.getInstance();

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await ssrMonitor.shutdown();
  });
}