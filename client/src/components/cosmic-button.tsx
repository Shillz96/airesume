import React from 'react';
import { ThemeButton } from './theme/ModernThemeButton';

/**
 * Re-export of ThemeButton for backward compatibility
 * This allows existing components to continue using CosmicButton
 * while we transition to the new unified theme system
 */

export const CosmicButton = ThemeButton;
export default CosmicButton;