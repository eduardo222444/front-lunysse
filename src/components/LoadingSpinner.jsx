export const LoadingSpinner = ({size = 'md'}) => {
  const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-16 w-16',
  }
  return (
      <div className="flex justisy-center items-center">
          <div
          className={`${sizes[size]} border-light/30 boder-t-light rounded-full animate-spin`}
          ></div>
      </div>
  )
}
