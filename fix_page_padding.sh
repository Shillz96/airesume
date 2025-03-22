#!/bin/bash

# List of main page files
PAGES="client/src/pages/admin-access.tsx client/src/pages/auth-page.tsx client/src/pages/job-details.tsx client/src/pages/resumes-page.tsx client/src/pages/subscription-page.tsx client/src/pages/refactored-resume-builder.tsx client/src/pages/home-page.tsx client/src/pages/landing-page.tsx"

for page in $PAGES; do
  echo "Processing $page for padding fixes..."
  
  # Replace excessive padding with standardized pt-4
  sed -i 's/pt-12/pt-4/g' $page
  sed -i 's/pt-16/pt-4/g' $page
  sed -i 's/pt-10/pt-4/g' $page
  sed -i 's/pt-8/pt-4/g' $page
  
  echo "Done with $page"
done

echo "All padding standardized to pt-4!"
