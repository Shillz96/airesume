// Education Tips Component that matches cosmic styling
export default function EducationTips() {
  return (
    <div className="bg-gray-900/50 border border-blue-500/30 rounded-md p-4 text-white text-sm">
      <p className="mb-3 text-blue-300 font-medium">
        Tips for education section:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>List your most recent education first</li>
        <li>Include relevant coursework and achievements</li>
        <li>Mention academic honors and awards</li>
        <li>Only include GPA if it strengthens your profile</li>
      </ul>
    </div>
  );
}