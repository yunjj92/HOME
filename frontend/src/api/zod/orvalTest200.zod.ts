import { z } from 'zod';

export const orvalTest200Schema = z.any();
export type OrvalTest200 = z.infer<typeof orvalTest200Schema>;
