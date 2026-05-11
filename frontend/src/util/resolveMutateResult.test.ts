import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveMutateResult } from './resolveMutateResult';
import { type UseMutationResult } from '@tanstack/react-query';
import { z } from 'zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { ERROR_STATUS, ERROR_MESSAGES } from './errorConstants';

describe('resolveMutateResult', () => {
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
    const resultSuccess = resolveMutateResult({ ...baseMutationResult, isSuccess: true } as UseMutationResult<any, any, any, any>);
    expect(resultSuccess.isSuccess).toBe(true);

    const resultFailure = resolveMutateResult({ ...baseMutationResult, isSuccess: false } as UseMutationResult<any, any, any, any>);
    expect(resultFailure.isSuccess).toBe(false);
  });

  it('should return alertErrorIntoMap as null when there is no error', () => {
    const result = resolveMutateResult(baseMutationResult);
    expect(result.alertErrorIntoMap).toBeNull();
  });

  it('should return alertErrorIntoMap with mapped message on Axios error', () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: ERROR_STATUS.UNAUTHORIZED,
        data: {
          apiError: {
            message: 'Original Error Message'
          }
        }
      } as AxiosResponse
    } as AxiosError;

    const result = resolveMutateResult({ ...baseMutationResult, error: mockError } as UseMutationResult<any, any, any, any>);
    
    expect(result.alertErrorIntoMap).toBeInstanceOf(Error);
    expect(result.alertErrorIntoMap?.message).toContain(ERROR_MESSAGES[ERROR_STATUS.UNAUTHORIZED]);
    expect(result.alertErrorIntoMap?.message).toContain('Original Error Message');
    expect((result.alertErrorIntoMap as any).status).toBe(ERROR_STATUS.UNAUTHORIZED);
  });

  it('should return alertErrorIntoMap with details when available in Axios error', () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: ERROR_STATUS.BAD_REQUEST,
        data: {
          apiError: {
            message: 'Validation Error',
            details: ['field1 is required', 'field2 is too short']
          }
        }
      } as AxiosResponse
    } as AxiosError;

    const result = resolveMutateResult({ ...baseMutationResult, error: mockError } as UseMutationResult<any, any, any, any>);
    
    expect(result.alertErrorIntoMap?.message).toContain('field1 is required');
    expect(result.alertErrorIntoMap?.message).toContain('field2 is too short');
    expect((result.alertErrorIntoMap as any).details).toEqual(['field1 is required', 'field2 is too short']);
  });

  describe('resolveMutateAsync', () => {
    it('should call mutateAsync when no schema is provided', async () => {
      mockMutateAsync.mockResolvedValue({ success: true, data: 'success-data' });
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      
      const result = await resolveMutateAsync({ id: 1 });
      
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ success: true, data: 'success-data' });
    });

    it('should call mutateAsync when validation succeeds with schema', async () => {
      mockMutateAsync.mockResolvedValue({ success: true, data: 'success-data' });
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      const result = await resolveMutateAsync({ id: 1 }, schema);
      
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ success: true, data: 'success-data' });
    });

    it('should throw Error with details when validation fails with schema', async () => {
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      try {
        await resolveMutateAsync({ id: 'not-a-number' }, schema);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain(ERROR_MESSAGES[ERROR_STATUS.BAD_REQUEST]);
        expect(err.message).toContain(ERROR_MESSAGES.VALIDATION_FAILED);
        expect(err.message).toContain('id:'); 
        expect((err as any).status).toBe(ERROR_STATUS.BAD_REQUEST);
      }
      
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should throw application-level error when success is false', async () => {
      mockMutateAsync.mockResolvedValue({ 
        success: false, 
        apiError: { message: 'Application Error' } 
      });
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      
      try {
        await resolveMutateAsync({ id: 1 });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('Application Error');
        expect((err as any).status).toBe(ERROR_STATUS.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw application-level error when data is missing', async () => {
      mockMutateAsync.mockResolvedValue({ 
        success: true, 
        data: null 
      });
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      
      try {
        await resolveMutateAsync({ id: 1 });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain(ERROR_MESSAGES[ERROR_STATUS.INTERNAL_SERVER_ERROR]);
        expect((err as any).status).toBe(ERROR_STATUS.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw Error when variables are null/undefined and schema is provided', async () => {
      const { resolveMutateAsync } = resolveMutateResult(baseMutationResult);
      const schema = z.object({ id: z.number() });
      
      try {
        await resolveMutateAsync(null as any, schema);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain(ERROR_MESSAGES[ERROR_STATUS.INTERNAL_SERVER_ERROR]);
        expect(err.message).toContain(ERROR_MESSAGES.NULL_OR_UNDEFINED);
        expect((err as any).status).toBe(ERROR_STATUS.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
