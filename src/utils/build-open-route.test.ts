import { describe, it, expect } from 'vitest';
import { crossDatasetChoice, payloadServerId } from './build-open-route';
import { DATASET_IDS } from '@/data/dataset';

const payload = (serverId?: unknown) =>
  JSON.stringify({ version: 4, build: serverId === undefined ? {} : { serverId } });

describe('payloadServerId', () => {
  it.each(DATASET_IDS)('reads %s off the file', (id) => {
    expect(payloadServerId(payload(id))).toBe(id);
  });

  it('reads a file predating the field as Homecoming, like hydrateBuild does', () => {
    expect(payloadServerId(payload())).toBe('homecoming');
  });

  it('answers null for a dataset this build does not ship', () => {
    expect(payloadServerId(payload('excelsior'))).toBeNull();
  });

  it('answers null for text that is not a build at all', () => {
    expect(payloadServerId('not json')).toBeNull();
  });
});

describe('crossDatasetChoice', () => {
  it('asks nothing when the file is already on the loaded dataset', () => {
    expect(crossDatasetChoice(payload('brainstorm'), 'brainstorm')).toBeNull();
  });

  it('names the file own server when it differs', () => {
    expect(crossDatasetChoice(payload('homecoming'), 'brainstorm')).toBe('homecoming');
  });

  it('asks nothing about a file no dataset can read — the reader refuses it, not the prompt', () => {
    expect(crossDatasetChoice(payload('excelsior'), 'homecoming')).toBeNull();
  });
});
