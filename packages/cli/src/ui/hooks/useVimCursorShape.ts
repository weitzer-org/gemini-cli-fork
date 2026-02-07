/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useVimMode } from '../contexts/VimModeContext.js';
import { useSettings } from '../contexts/SettingsContext.js';

// ANSI escape codes for cursor shapes
const CURSOR_SHAPE_STEADY_BLOCK = '\x1b[2 q';
const CURSOR_SHAPE_STEADY_BAR = '\x1b[6 q';
const CURSOR_SHAPE_DEFAULT = '\x1b[0 q';

export function useVimCursorShape() {
  const { vimEnabled, vimMode } = useVimMode();
  const { settings } = useSettings();
  const { vimModeCursorShape } = settings.merged.general;

  useEffect(() => {
    if (vimEnabled && vimModeCursorShape) {
      if (vimMode === 'NORMAL') {
        process.stdout.write(CURSOR_SHAPE_STEADY_BLOCK);
      } else {
        process.stdout.write(CURSOR_SHAPE_STEADY_BAR);
      }
    }

    return () => {
      if (vimEnabled && vimModeCursorShape) {
        process.stdout.write(CURSOR_SHAPE_DEFAULT);
      }
    };
  }, [vimEnabled, vimMode, vimModeCursorShape]);

  // This hook is for side-effects only, so it doesn't return anything.
}
