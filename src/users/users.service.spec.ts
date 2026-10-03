import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { UserRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService.createUser', () => {
  it('rejects an email that is already registered', async () => {
    const repository = {
      findOne: vi.fn().mockResolvedValue({
        _id: { toString: () => 'user-id' },
        email: 'ada@example.com',
        name: 'Ada',
      }),
      create: vi.fn(),
    } as unknown as UserRepository;
    const service = new UsersService(repository);

    await expect(
      service.createUser({ email: 'ada@example.com', name: 'Ada' }),
    ).rejects.toThrow(new UnprocessableEntityException('Email already exists'));

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('creates a user when the email is not registered', async () => {
    const repository = {
      findOne: vi.fn().mockRejectedValue(new NotFoundException()),
      create: vi.fn().mockResolvedValue({
        _id: { toString: () => 'user-id' },
        email: 'ada@example.com',
        name: 'Ada',
      }),
    } as unknown as UserRepository;
    const service = new UsersService(repository);

    await expect(
      service.createUser({ email: ' ADA@EXAMPLE.COM ', name: 'Ada' }),
    ).resolves.toEqual({
      _id: 'user-id',
      email: 'ada@example.com',
      name: 'Ada',
    });

    expect(repository.create).toHaveBeenCalledWith({
      email: 'ada@example.com',
      name: 'Ada',
    });
  });
});
