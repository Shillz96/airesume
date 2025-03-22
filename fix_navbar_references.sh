#!/bin/bash

# List of pages to fix
PAGES="client/src/pages/admin-access.tsx client/src/pages/auth-page.tsx client/src/pages/job-details.tsx client/src/pages/resumes-page.tsx client/src/pages/subscription-page.tsx client/src/pages/refactored-resume-builder.tsx"

for page in $PAGES; do
  echo "Processing $page..."
  
  # Remove the Navbar import
  sed -i 's/import Navbar from "@\/components\/navbar";//g' $page
  
  # Remove the Navbar tags from the component render function
  sed -i 's/<Navbar \/>//g' $page
  
  echo "Done with $page"
done

echo "All navbar references fixed!"
