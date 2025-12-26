function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-12">
      <h2 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader

