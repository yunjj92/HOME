import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateMutateResult } from './validateMutateResult';
import { type UseMutationResult } from '@tanstack/react-query';
import { z } from 'zod';
import { AxiosError, type AxiosResponse } from 'axios';

describe('validateMutateResult', () => {
  const mockMutateAsync = vi.fn();
  
  const baseMutationResult = {
    mutateAsync: mockMutateAsync,
    isSuccess: false,
    error: null,
  } as unknown as UseMutationResult<any, any, any, any>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isSuccess correctly', () => {
    const resultSuccess = validateMutateResult({ ...baseMutationResult, isSuccess: true } as UseMutationResult<any, any, any, any>);
    expect(resultSuccess.isSuccess).toBe(true);

    const resultFailure = validateMutateResult({ ...baseMutationResult, isSuccess: false } as UseMutationResult<any, any, any, any>);
    expect(resultFailure.isSuccess).toBe(false);
  });

  it('should return alertErrorIntoMap as null when there is no error', () => {
    const result = validateMutateResult(baseMutationResult);
    expect(result.alertErrorIntoMap).toBeNull();
  });

  it('should return alertErrorIntoMap with mapped message on Axios error', () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          apiError: {
            message: 'Original Error Message'
          }
        }
      } as AxiosResponse
    } as AxiosError;

    const result = validateMutateResult({ ...baseMutationResult, error: mockError } as UseMutationResult<any, any, any, any>);
    
    expect(result.alertErrorIntoMap).toBeInstanceOf(Error);
    expect(result.alertErrorIntoMap?.message).toBe('Unauthorized Access - Please log in.');
    expect((result.alertErrorIntoMap as any).status).toBe(401);
  });

  it('should return alertErrorIntoMap with original message if status not in map', () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: 418, // I'm a teapot
        data: {
          apiError: {
            message: 'Original Error Message'
          }
        }
      } as AxiosResponse
    } as AxiosError;

    const result = validateMutateResult({ ...baseMutationResult, error: mockError } as UseMutationResult<any, any, any, any>);
    
    expect(result.alertErrorIntoMap).toBeInstanceOf(Error);
    expect(result.alertErrorIntoMap?.message).toBe('Original Error Message');
    expect((result.alertErrorIntoMap as any).status).toBe(418);
  });

  describe('validateMutateAsync', () => {
    it('should call mutateAsync when no schema is provided', async () => {
      mockMutateAsync.mockResolvedValue('success-data');
      const { validateMutateAsync } = validateMutateResult(baseMutationResult);
      
      const result = await validateMutateAsync({ id: 1 });
      
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe('success-data');
    });

    it('should call mutateAsync when validation succeeds with schema', async () => {
      mockMutateAsync.mockResolvedValue('success-data');
      const { validateMutateAsync } = validateMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      const result = await validateMutateAsync({ id: 1 }, schema);
      
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe('success-data');
    });

    it('should throw Error when validation fails with schema', async () => {
      const { validateMutateAsync } = validateMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      try {
        await validateMutateAsync({ id: 'not-a-number' }, schema);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toBe('Bad Request');
        expect((err as any).status).toBe(400);
      }
      
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should throw Error when variables are null/undefined and schema is provided', async () => {
      const { validateMutateAsync } = validateMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      try {
        await validateMutateAsync(null as any, schema);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toBe('Internal Server Error');
        expect((err as any).status).toBe(500);
      }
    });

    it('should propagate errors from mutateAsync', async () => {
      const expectedError = new Error('Mutation failed');
      mockMutateAsync.mockRejectedValue(expectedError);
      const { validateMutateAsync } = validateMutateResult(baseMutationResult);
      
      await expect(validateMutateAsync({ id: 1 })).rejects.toThrow('Mutation failed');
    });
  });
});
