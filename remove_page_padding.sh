#!/bin/bash

# List of main page files
PAGES="client/src/pages/admin-access.tsx client/src/pages/auth-page.tsx client/src/pages/job-details.tsx client/src/pages/resumes-page.tsx client/src/pages/subscription-page.tsx client/src/pages/refactored-resume-builder.tsx client/src/pages/home-page.tsx client/src/pages/landing-page.tsx"

for page in $PAGES; do
  echo "Removing padding from $page..."
  
  # Remove top padding completely - since it's now handled by the App.tsx container
  sed -i 's/pt-4//g' $page
  
  echo "Done with $page"
done

echo "All top padding removed from individual pages!"
