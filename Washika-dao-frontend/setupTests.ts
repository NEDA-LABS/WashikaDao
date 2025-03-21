import { afterEach , vi } from 'vitest';
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

globalThis.vi = vi;
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
})