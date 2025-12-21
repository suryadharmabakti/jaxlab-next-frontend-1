export default function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 animate-pulse">
          <td className="px-5 py-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
          </td>
          <td className="px-5 py-3">
            <div className="h-4 w-48 rounded bg-gray-200" />
          </td>
          <td className="px-5 py-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
          </td>
          <td className="px-5 py-3">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
          </td>
          <td className="px-5 py-3 text-right">
            <div className="h-4 w-6 rounded bg-gray-200 ml-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
