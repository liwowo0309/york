# Keep progress across versions

## Change

Old saves still load after wardrobe, books, and the new bag. Food, clothes, day, and gold are mapped forward. The original file is copied to a backup key before the first upgrade.

## Rationale

依月 already has days of play. A new shop or stat must not start her over.

## What we refused

- The localStorage key stays `yiyue-home-save-v1`. Renaming it would hide every old save.
- Starting over still asks first, and still only then clears the live save.
