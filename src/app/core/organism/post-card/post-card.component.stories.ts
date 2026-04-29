import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, icons } from 'lucide-angular';
import { AuthStore } from '@store/index';
import { Post, Comment } from '@core/models';
import { PostCardComponent } from './post-card.component';
const mockCurrentUser = {
  id: '1',
  name: 'Mariano',
  email: 'mariano@mail.com',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mariano',
  provider: 'email' as const,
};

const mockAuthStore = {
  currentUser: () => mockCurrentUser,
};

const basePost: Post = {
  id: 'p1',
  authorId: '2',
  authorName: 'Ana García',
  authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
  content: 'Arrancando el día con toda la energía',
  imageUrl: undefined,
  likes: ['1', '3'],
  commentCount: 2,
  createdAt: Date.now() - 1000 * 60 * 12,
};

const comments: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    authorId: '1',
    authorName: 'Mariano',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mariano',
    content: 'Muy buen post 👏',
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'c2',
    postId: 'p1',
    authorId: '3',
    authorName: 'Lucía Fernández',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lucia',
    content: 'Totalmente de acuerdo!',
    createdAt: Date.now() - 1000 * 60 * 2,
  },
];

const meta: Meta<PostCardComponent> = {
  title: 'Organisms/Post Card',
  component: PostCardComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        importProvidersFrom(LucideAngularModule.pick(icons)),
        {
          provide: AuthStore,
          useValue: mockAuthStore,
        },
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  args: {
    post: basePost,
    liked: false,
    showComments: false,
    comments: [],
  },
};

export default meta;

type Story = StoryObj<PostCardComponent>;

export const Default: Story = {};

export const Liked: Story = {
  args: {
    liked: true,
    post: {
      ...basePost,
      likes: ['1', '3', '4'],
    },
  },
};

export const WithComments: Story = {
  args: {
    showComments: true,
    comments,
    post: {
      ...basePost,
      commentCount: comments.length,
    },
  },
};

export const OwnerPost: Story = {
  args: {
    post: {
      ...basePost,
      authorId: '1',
      authorName: 'Mariano',
      authorAvatar: mockCurrentUser.avatar,
    },
  },
};

export const WithImage: Story = {
  args: {
    post: {
      ...basePost,
      imageUrl: 'https://picsum.photos/800/450',
    },
  },
};

export const WithoutAvatar: Story = {
  args: {
    post: {
      ...basePost,
      authorAvatar: undefined,
    },
  },
};

export const LongContent: Story = {
  args: {
    post: {
      ...basePost,
      content:
        'Este es un post más largo para probar cómo se comporta la card cuando el contenido ocupa varias líneas. Sirve para validar espaciado, line-height, wrapping y consistencia visual dentro del feed.',
    },
  },
};
