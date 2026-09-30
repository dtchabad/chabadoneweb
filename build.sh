#!/bin/sh
# Builds dist/header-snippet.html - the single block to paste into the
# Chabadone site-wide header. Re-run after editing the .css or .js.
set -e
cd "$(dirname "$0")"
mkdir -p dist
{
  echo '<!-- CYP Simchat Torah (article 6284529) - safe on every page; only activates on that article -->'
  echo '<style>'
  cat cyp-simchat-torah.css
  echo '</style>'
  echo '<script>'
  cat cyp-simchat-torah.js
  echo '</script>'
} > dist/header-snippet.html
echo "wrote dist/header-snippet.html ($(wc -c < dist/header-snippet.html) bytes)"
