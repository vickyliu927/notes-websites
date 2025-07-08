// Enhanced Error Logging and Reporting Utility for Clone System
// Part of Prompt 12 Implementation

import React from 'react'

interface ErrorContext {
  cloneId?: string
  hostname?: string
  pathname?: string
  userAgent?: string
  userId?: string
  sessionId?: string
  timestamp: number
}

interface ErrorEntry {
  id: string
  level: 'info' | 'warn' | 'error' | 'critical'
  message: string
  error?: Error
  context: ErrorContext
  stack?: string
  resolved: boolean
  createdAt: number
  resolvedAt?: number
}

class CloneSystemLogger {
  private errors: ErrorEntry[] = []
  private maxEntries = 1000
  private listeners: Array<(entry: ErrorEntry) => void> = []

  // Log an error with context
  log(
    level: ErrorEntry['level'],
    message: string,
    error?: Error,
    context: Partial<ErrorContext> = {}
  ): string {
    const id = this.generateId()
    const entry: ErrorEntry = {
      id,
      level,
      message,
      error,
      context: {
        ...context,
        timestamp: Date.now()
      },
      stack: error?.stack,
      resolved: false,
      createdAt: Date.now()
    }

    this.errors.unshift(entry)
    
    // Keep only max entries
    if (this.errors.length > this.maxEntries) {
      this.errors = this.errors.slice(0, this.maxEntries)
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(entry)
      } catch (err) {
        console.error('Error in logger listener:', err)
      }
    })

    // Console output based on level
    this.consoleOutput(entry)

    // Send to performance API if available
    this.sendToPerformanceAPI(entry)

    return id
  }

  // Convenience methods
  info(message: string, context?: Partial<ErrorContext>): string {
    return this.log('info', message, undefined, context)
  }

  warn(message: string, error?: Error, context?: Partial<ErrorContext>): string {
    return this.log('warn', message, error, context)
  }

  error(message: string, error?: Error, context?: Partial<ErrorContext>): string {
    return this.log('error', message, error, context)
  }

  critical(message: string, error?: Error, context?: Partial<ErrorContext>): string {
    return this.log('critical', message, error, context)
  }

  // Clone-specific logging methods
  cloneDomainLookup(hostname: string, cloneId: string | null, duration: number, success: boolean): string {
    return this.info(`Domain lookup: ${hostname} -> ${cloneId || 'none'}`, {
      hostname,
      cloneId: cloneId || undefined,
      pathname: '/domain-lookup'
    })
  }

  cloneRouteError(cloneId: string, pathname: string, error: Error): string {
    return this.error(`Clone route error: ${cloneId}${pathname}`, error, {
      cloneId,
      pathname
    })
  }

  middlewareError(hostname: string, error: Error): string {
    return this.error(`Middleware error for ${hostname}`, error, {
      hostname,
      pathname: '/middleware'
    })
  }

  cacheError(operation: string, hostname: string, error: Error): string {
    return this.error(`Cache ${operation} error for ${hostname}`, error, {
      hostname,
      pathname: '/cache'
    })
  }

  componentFallback(component: string, cloneId: string, fallbackType: string): string {
    return this.warn(`Component ${component} fallback to ${fallbackType}`, undefined, {
      cloneId,
      pathname: `/component/${component}`
    })
  }

  // Get errors with filtering
  getErrors(filters: {
    level?: ErrorEntry['level']
    cloneId?: string
    hostname?: string
    since?: number
    resolved?: boolean
  } = {}): ErrorEntry[] {
    return this.errors.filter(entry => {
      if (filters.level && entry.level !== filters.level) return false
      if (filters.cloneId && entry.context.cloneId !== filters.cloneId) return false
      if (filters.hostname && entry.context.hostname !== filters.hostname) return false
      if (filters.since && entry.createdAt < filters.since) return false
      if (filters.resolved !== undefined && entry.resolved !== filters.resolved) return false
      return true
    })
  }

  // Get error statistics
  getStats(timeWindow: number = 24 * 60 * 60 * 1000): {
    total: number
    byLevel: Record<string, number>
    byClone: Record<string, number>
    byHostname: Record<string, number>
    recent: number
    resolved: number
  } {
    const cutoff = Date.now() - timeWindow
    const recentErrors = this.errors.filter(e => e.createdAt > cutoff)

    const stats = {
      total: recentErrors.length,
      byLevel: {} as Record<string, number>,
      byClone: {} as Record<string, number>,
      byHostname: {} as Record<string, number>,
      recent: recentErrors.filter(e => e.createdAt > Date.now() - (60 * 60 * 1000)).length,
      resolved: recentErrors.filter(e => e.resolved).length
    }

    recentErrors.forEach(entry => {
      // By level
      stats.byLevel[entry.level] = (stats.byLevel[entry.level] || 0) + 1

      // By clone
      if (entry.context.cloneId) {
        stats.byClone[entry.context.cloneId] = (stats.byClone[entry.context.cloneId] || 0) + 1
      }

      // By hostname
      if (entry.context.hostname) {
        stats.byHostname[entry.context.hostname] = (stats.byHostname[entry.context.hostname] || 0) + 1
      }
    })

    return stats
  }

  // Mark error as resolved
  resolve(errorId: string): boolean {
    const entry = this.errors.find(e => e.id === errorId)
    if (entry && !entry.resolved) {
      entry.resolved = true
      entry.resolvedAt = Date.now()
      return true
    }
    return false
  }

  // Clear errors
  clear(filters: { level?: ErrorEntry['level'], older?: number } = {}): number {
    const before = this.errors.length
    
    if (filters.older) {
      const cutoff = Date.now() - filters.older
      this.errors = this.errors.filter(e => e.createdAt > cutoff)
    }
    
    if (filters.level) {
      this.errors = this.errors.filter(e => e.level !== filters.level)
    }
    
    if (!filters.level && !filters.older) {
      this.errors = []
    }

    return before - this.errors.length
  }

  // Add listener for real-time monitoring
  addListener(listener: (entry: ErrorEntry) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Export errors for analysis
  export(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = 'ID,Level,Message,CloneID,Hostname,Pathname,Timestamp,Resolved'
      const rows = this.errors.map(entry => [
        entry.id,
        entry.level,
        `"${entry.message.replace(/"/g, '""')}"`,
        entry.context.cloneId || '',
        entry.context.hostname || '',
        entry.context.pathname || '',
        new Date(entry.createdAt).toISOString(),
        entry.resolved
      ].join(','))
      
      return [headers, ...rows].join('\n')
    }

    return JSON.stringify(this.errors, null, 2)
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Console output based on level
  private consoleOutput(entry: ErrorEntry): void {
    const prefix = `[CLONE-SYSTEM] ${entry.level.toUpperCase()}`
    const context = entry.context.cloneId ? ` [${entry.context.cloneId}]` : ''
    const message = `${prefix}${context}: ${entry.message}`

    switch (entry.level) {
      case 'info':
        console.info(message)
        break
      case 'warn':
        console.warn(message, entry.error)
        break
      case 'error':
        console.error(message, entry.error)
        break
      case 'critical':
        console.error(`🚨 ${message}`, entry.error)
        break
    }
  }

  // Send to performance API
  private async sendToPerformanceAPI(entry: ErrorEntry): Promise<void> {
    if (typeof window === 'undefined') return // Server-side only for now

    try {
      await fetch('/api/debug-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          data: {
            error: entry.message,
            context: entry.level,
            hostname: entry.context.hostname,
            cloneId: entry.context.cloneId
          }
        })
      })
    } catch (err) {
      // Silently fail - don't log errors about logging errors
    }
  }
}

// Global logger instance
export const cloneLogger = new CloneSystemLogger()

// React hook for real-time error monitoring
export function useErrorMonitor(filters?: {
  level?: ErrorEntry['level']
  cloneId?: string
}) {
  if (typeof window === 'undefined') {
    return { errors: [], stats: null }
  }

  const [errors, setErrors] = React.useState<ErrorEntry[]>([])
  const [stats, setStats] = React.useState<{
    total: number
    byLevel: Record<string, number>
    byClone: Record<string, number>
    byHostname: Record<string, number>
    recent: number
    resolved: number
  } | null>(null)

  React.useEffect(() => {
    const updateErrors = () => {
      setErrors(cloneLogger.getErrors(filters))
      setStats(cloneLogger.getStats())
    }

    updateErrors()
    const removeListener = cloneLogger.addListener(updateErrors)

    const interval = setInterval(updateErrors, 5000) // Update every 5 seconds

    return () => {
      removeListener()
      clearInterval(interval)
    }
  }, [filters])

  return { errors, stats }
}

// Middleware integration helper
export function withErrorLogging<T extends (...args: any[]) => any>(
  fn: T,
  context: Partial<ErrorContext> = {}
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result && typeof result.catch === 'function') {
        return result.catch((error: Error) => {
          cloneLogger.error(`Async function error: ${fn.name}`, error, context)
          throw error
        })
      }
      
      return result
    } catch (error) {
      cloneLogger.error(`Function error: ${fn.name}`, error as Error, context)
      throw error
    }
  }) as T
}

// Types export
export type { ErrorEntry, ErrorContext } 