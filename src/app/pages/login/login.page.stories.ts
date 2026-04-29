import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, icons } from 'lucide-angular';

import { AuthStore, UiStore } from '@store/index';
import { LoginPage } from './login.page';

class MockAuthStore {
  loading = () => false;
  isAuthenticated = () => false;
  error = () => null;
  currentUser = () => ({ id: '1', name: 'Ana' });

  async loginWithEmail(email: string, password: string) {
    console.log('Mock login email:', email, password);
  }

  async loginWithGoogle() {
    console.log('Mock Google login');
  }
}

class MockUiStore {
  success(summary: string, detail?: string) {
    console.log('SUCCESS:', summary, detail);
  }

  danger(summary: string, detail?: string) {
    console.log('ERROR:', summary, detail);
  }
}

const meta: Meta<LoginPage> = {
  title: 'Pages/Login',
  component: LoginPage,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        importProvidersFrom(LucideAngularModule.pick(icons)),
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: UiStore, useClass: MockUiStore },
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<LoginPage>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        importProvidersFrom(LucideAngularModule.pick(icons)),
        {
          provide: AuthStore,
          useValue: {
            loading: () => true,
            isAuthenticated: () => false,
            error: () => null,
            currentUser: () => null,
            loginWithEmail: async () => {},
            loginWithGoogle: async () => {},
          },
        },
        { provide: UiStore, useClass: MockUiStore },
      ],
    }),
  ],
};

export const WithErrors: Story = {
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form');
    const inputs = canvasElement.querySelectorAll('input');

    inputs.forEach((input) => {
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
    });

    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  },
};

export const AuthError: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        importProvidersFrom(LucideAngularModule.pick(icons)),
        {
          provide: AuthStore,
          useValue: {
            loading: () => false,
            isAuthenticated: () => false,
            error: () => 'Credenciales inválidas',
            currentUser: () => null,
            loginWithEmail: async () => {},
            loginWithGoogle: async () => {},
          },
        },
        { provide: UiStore, useClass: MockUiStore },
      ],
    }),
  ],
};
