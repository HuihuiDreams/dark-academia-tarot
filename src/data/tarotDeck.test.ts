import { describe, it, expect } from 'vitest';
import { MAJOR_ARCANA, getRandomSpread } from './tarotDeck';

describe('Tarot Deck Data', () => {
  it('should have exactly 22 Major Arcana cards', () => {
    expect(MAJOR_ARCANA).toHaveLength(22);
  });

  it('should have unique IDs for all cards', () => {
    const ids = MAJOR_ARCANA.map(card => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(22);
  });

  it('should include necessary fields for each card', () => {
    MAJOR_ARCANA.forEach(card => {
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.nameCn).toBeDefined();
      expect(card.image).toContain('.svg');
      expect(card.uprightMeaning).toBeDefined();
      expect(card.reversedMeaning).toBeDefined();
      expect(card.darkAcademiaInsight).toBeDefined();
    });
  });
});

describe('getRandomSpread', () => {
  it('should return exactly 3 cards by default', () => {
    const spread = getRandomSpread();
    expect(spread).toHaveLength(3);
  });

  it('should return the requested number of cards', () => {
    const spread = getRandomSpread(5);
    expect(spread).toHaveLength(5);
  });

  it('should return unique cards in a spread', () => {
    const spread = getRandomSpread(5);
    const ids = spread.map(item => item.card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(5);
  });

  it('should include upright/reversed state and position labels', () => {
    const spread = getRandomSpread(1);
    const item = spread[0];
    expect(typeof item.isReversed).toBe('boolean');
    expect(item.positionLabel).toBeDefined();
    expect(item.positionInsight).toBeDefined();
  });
});
