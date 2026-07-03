import { describe, expect, it } from '@jest/globals';
import {
  calculateSMSParts,
  calculateTotalCharacterCount,
  countCharacters,
} from './campaignUtils';

describe('campaignUtils SMS counting', () => {
  it('counts the adlink characters when short link is disabled', () => {
    const text = 'Visit {YOUR_LINK}';
    const adLink = 'https://example.com/promo/{uid}';

    expect(countCharacters(text, adLink, null, 'sms')).toBe(44);
  });

  it('counts the short link characters when a short link domain is enabled', () => {
    const text = 'Visit {YOUR_LINK}';
    const adLink = 'https://example.com/promo/{uid}';

    expect(countCharacters(text, adLink, 'jo1n.ir', 'sms')).toBe(26);
  });

  it('returns matching total characters and parts for raw adlink substitution', () => {
    const result = calculateTotalCharacterCount(
      'Visit {YOUR_LINK}',
      true,
      'https://example.com/promo/{uid}',
      null,
      'sms'
    );

    expect(result.startCount).toBe(6);
    expect(result.characterCount).toBe(38);
    expect(result.totalCharacterCount).toBe(44);
    expect(calculateSMSParts(result.totalCharacterCount)).toBe(1);
  });
});
