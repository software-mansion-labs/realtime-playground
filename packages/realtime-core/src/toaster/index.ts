export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

export interface ExtraPayload {
  description?: string
  duration?: number
  id?: string
}

export interface ToasterProvider {
  info: (title: string, input?: ExtraPayload) => string
  error: (title: string, input?: ExtraPayload) => string
  success: (title: string, input?: ExtraPayload) => string
  warning: (title: string, input?: ExtraPayload) => string
}

class ToasterWrapper {
  provider?: ToasterProvider

  setProvider(provider: ToasterProvider) {
    this.provider = provider
  }

  private validateProvider(): asserts this is { provider: ToasterProvider } {
    if (!this.provider) {
      throw new Error('Toaster provider not set')
    }
  }

  info(title: string, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.info(title, input)
  }

  error(title: string, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.error(title, input)
  }

  success(title: string, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.success(title, input)
  }

  warning(title: string, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.warning(title, input)
  }
}

export const toast = new ToasterWrapper()
