import type { Catalog } from '@/types';

/** A minimal but valid catalog for unit tests. */
export const testCatalog: Catalog = {
  financingDivisor: 10,
  shipping: { label: 'Fast Shipping', icon: 'truck', compareAt: 5.99, price: 0 },
  steps: [
    {
      id: 'cameras',
      title: 'Choose your cameras',
      icon: 'camera',
      nextLabel: 'Next',
      selectionMode: 'multi',
    },
    {
      id: 'plan',
      title: 'Choose your plan',
      icon: 'shield',
      nextLabel: null,
      selectionMode: 'single',
    },
  ],
  products: [
    {
      id: 'cam-v4',
      step: 'cameras',
      reviewGroup: 'Cameras',
      name: 'Wyze Cam v4',
      icon: 'camera',
      price: 27.98,
      compareAt: 35.98,
      variants: [
        { id: 'white', label: 'White', swatch: '#fff' },
        { id: 'black', label: 'Black', swatch: '#000' },
      ],
      seed: { white: 1 },
    },
    {
      id: 'plan-unlimited',
      step: 'plan',
      reviewGroup: 'Plan',
      name: 'Cam Unlimited',
      icon: 'plan',
      price: 9.99,
      priceSuffix: '/mo',
      seed: { default: 1 },
    },
    {
      id: 'plan-basic',
      step: 'plan',
      reviewGroup: 'Plan',
      name: 'Cam Basic',
      icon: 'plan',
      price: 0,
      freeWhenZero: true,
      seed: { default: 0 },
    },
  ],
};
